const Joi = require('joi');
const Account = require('models/Account');

module.exports = {
    localRegister: async ctx => {
        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(4).max(15).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
        });

        const result = Joi.validate(ctx.request.body, schema);

        if (result.error) {
            ctx.status = 400;
            return;
        }

        let existing = null;
        try {
            existing = await Account.findByEmailOrUsername(ctx.request.body);
        } catch (e) {
            ctx.throw(500, e);
        }

        if (existing) {
            ctx.status = 409; // Conflict
            ctx.body = {
                key: existing.email === ctx.request.body.email ?
                    'email' :
                    'username',
            };
            return;
        }

        let account = null;
        try {
            account = await Account.localRegister(ctx.request.body);
        } catch (e) {
            ctx.throw(500, e);
        }

        ctx.body = account.profile;
    },
    localLogin: async ctx => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const result = Joi.validate(ctx.request.body, schema);

        if (result.error) {
            ctx.status = 400;
            return;
        }

        const { email, password } = ctx.request.body;

        let account = null;
        try {
            account = await Account.findByEmail(email);
        } catch (e) {
            ctx.throw(500, e);
        }

        if (!account || !account.validatePassword(password)) {
            ctx.status = 403; // Forbidden
            return;
        }

        ctx.body = account.profile;
    },
    exists: async ctx => {
        const { key, value } = ctx.params;
        let account = null;

        try {
            account = await (key === 'email' ?
                Account.findByEmail(value) :
                Account.findByUsername(value));
        } catch (e) {
            ctx.throw(500, e);
        }

        ctx.body = {
            exists: account !== null,
        };
    },
    logout: async ctx => {
        ctx.body = 'logout';
    },
};
