const Router = require('koa-router');
const books = require('./books');
const api = new Router();
const auth = require('./auth');

api.use('/auth', auth.routes());
api.use('/books', books.routes());

module.exports = api;
