const mongoose = require('mongoose');
const { Schema } = mongoose;
const { generateToken } = require('lib/token');
const crypto = require('crypto');

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).
        update(password).
        digest('hex');
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

Account.statics.findByUsername = username => {
    return this.findOne({ 'profile.username': username }).exec();
};

Account.statics.findByEmail = email => {
    return this.findOne({ email });
};

Account.statics.localRegister = ({ username, email, password }) => {
    const account = new this({
        profile: {
            username,
        },
        email,
        password: hash(password),
    });

    return account.save();
};

Account.methods.validatePassword = password => {
    const hashed = hash(password);
    return this.password === hashed;
};

Account.methods.generateToken = function() {
    const payload = {
        _id: this._id,
        profile: this.profile
    };

    return generateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account);
