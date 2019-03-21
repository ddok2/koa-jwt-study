const Book = require('models/book');

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
    delete: (ctx) => {
        ctx.body = 'deleted';
    },
    replace: (ctx) => {
        ctx.body = 'replaced';
    },
    update: (ctx) => {
        ctx.body = 'updated';
    },
};
