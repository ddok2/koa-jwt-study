const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

function generateToken(payload) {
    return new Promise(
        (resolve, reject) => {
            jwt.sign(
                payload,
                jwtSecret,
                {
                    expiresIn: '7d',
                }, (error, token) => {
                    if (error) reject(error);
                    resolve(token);
                },
            );
        },
    );
}

function decodeToken(token) {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, jwtSecret, (error, decoded) => {
                if (error) reject(error);

                resolve(decoded);
            });
        },
    );
}

const jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');
    if (!token) {
        return next();
    }

    try {
        const decoded = await decodeToken(token);

        if (Date.now() / 1000 - decoded.iat > 60 * 60 * 23) {
            const { _id, profile } = decoded;
            const freshToken = await generateToken({ _id, profile }, 'account');
            ctx.cookies.set('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
        }
        ctx.request.user = decoded;
    } catch (err) {
        ctx.request.user = null;
    }
    return next();
};

module.exports = {
    generateToken,
    decodeToken,
    jwtMiddleware
};
