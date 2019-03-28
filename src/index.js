require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');
const { jwtMiddleware } = require('lib/token');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise;

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true },
).then(() => {
    console.log(`Successfully connected to MongoDB`);
}).catch(err => {
    console.error(err);
});

const PORT = process.env.PORT || 4000;

app.use(bodyParser());
app.use(jwtMiddleware);
router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => {
    console.log(`Server is listening to port: ${PORT}`);
});
