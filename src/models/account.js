const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY)
        .update(password)
        .digest('hex');
}

const Account = new Schema({
    profile: {
        username: String,
        thumbnail: {
            type: String,
            default: '/static/images/default_thumbnail.png',
        },
    },
    email: { type: String },
    social: {
        facebook: { id: String, accessToken: String },
        google: { id: String, accessToken: String },
    },
    password: String,
    thoughtCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', Account);
