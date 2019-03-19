const Koa = require('koa');
const app = new Koa();

const PORT = 4000;

app.use(ctx => {
    ctx.body = 'Hello, Sung';
});

app.listen(PORT, () => {
    console.log(`Server is listening to port: ${PORT}`);
});
