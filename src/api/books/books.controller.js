const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

const Book = require('../../models/book');

module.exports = {
    get: async ctx => {
        const { id } = ctx.params;
        let book;

        try {
            book = await Book.findById(id).exec();
        } catch (err) {
            if (err.name === 'CastError') {
                ctx.status = 400;
                return;
            }
            return ctx.throw(500, err);
        }

        if (!book) {
            ctx.status = 404;
            ctx.body = { message: 'book not found' };
            return;
        }
        ctx.body = book;
    },
    list: async ctx => {
        let books;

        try {
            books = await Book.find().sort({ _id: -1 }).limit(3).exec();
        } catch (err) {
            return ctx.throw(500, err);
        }

        ctx.body = books;

    },
    create: async ctx => {
        const {
            title,
            authors,
            publishedDdate,
            price,
            tags,
        } = ctx.request.body;

        const book = new Book({
            title,
            authors,
            publishedDdate,
            price,
            tags,
        });

        try {
            await book.save();
        } catch (err) {
            return ctx.throw(500, err);
        }

        ctx.body = book;
    },
    delete: async ctx => {
        const { id } = ctx.params;

        try {
            await Book.findByIdAndRemove(id).exec();
        } catch (err) {
            if (err.name === 'CastError') {
                ctx.status = 400;
                return;
            }
        }
        ctx.status = 204;
    },
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

        let book;

        try {
            book = await Book.findByIdAndUpdate(id, ctx.request.body, {
                upsert: true,
                new: true,
            });
        } catch (err) {
            return ctx.throw(500, err);
        }

        ctx.body = book;
    },
    update: async ctx => {
        const { id } = ctx.params;

        if (!ObjectId.isValid(id)) {
            ctx.status = 400;
            return;
        }

        let book;

        try {
            book = await Book.findByIdAndUpdate(id, ctx.request.body, {
                new: true
            });
        } catch (e) {
            return ctx.throw(500, e);
        }

        ctx.body = book;
    },
};
