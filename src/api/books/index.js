const Router = require('koa-router');
const books = new Router();

const booksController = require('./books.controller');

books.get('/', booksController.list);

books.get('/:id', booksController.get);

books.post('/', booksController.create);

books.put('/', booksController.delete);

books.patch('/', booksController.replace);

books.delete('/', booksController.update);

module.exports = books;
