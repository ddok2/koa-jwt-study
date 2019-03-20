module.exports = {
    list: (ctx) => {
        ctx.body = 'listed';
    },
    create: (ctx) => {
        ctx.body = 'created';
    },
    delete: (ctx) => {
        ctx.body = 'deleted';
    },
    replace: (ctx) => {
        ctx.body = 'replaced';
    },
    update: (ctx) => {
        ctx.body = 'updated';
    }
};
