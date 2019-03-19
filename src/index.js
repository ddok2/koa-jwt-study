const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const PORT = 4000;

router.get('/', (ctx, next) => {
    ctx.body = 'home!';
});

router.get('/about', (ctx, next) => {
    ctx.body = 'about';
});

router.get('/about/:name', (ctx, next) => {
    const {name} = ctx.params;
    ctx.body = `${name}'s about `;
});

router.get('/post', (ctx, next) => {
    const {id} = ctx.request.query;
    if (id) {
        ctx.body = `post #${id}`;
    } else {
        ctx.body = 'no post id.';
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server is listening to port: ${PORT}`);
});
