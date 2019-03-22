const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

module.exports = {
    replace: async ctx => {
        const { id } = ctx.params;

        if (!ObjectId.isValid(id)) {
            ctx.status = 400;
            return;
        }

        const schema = Joi.object().keys({
            title: Joi.string().required(),
            authors: Joi.array().items(Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
            })),
            publishedDdate: Joi.date().required(),
            price: Joi.number().required(),
            tags: Joi.array().items((Joi.string()).required()),
        });

        const result = Joi.validate(ctx.request.body, schema);

        if (result.error) {
            ctx.status = 400;
            ctx.body = result.error;
            return;
        }
    },
};
