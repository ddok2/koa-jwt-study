const Router = require('koa-router');
const books = require('./books');
const api = new Router();

api.use('/books', books.routes());

module.exports = api;
