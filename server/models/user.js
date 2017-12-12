const validator = require('validator');
const _ = require('lodash');
const {
    mongoose
} = require('../db/mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trime: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});
function generateAuthToken() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({token, access});
    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.generateAuthToken = generateAuthToken;

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        throw e;
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};


const User = mongoose.model('User', UserSchema);

module.exports = User;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTJmNjEyNGEwYWRhNjExYTIzZjZiZjIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTEzMDU0NTAwfQ.etZjZFIYkdvajOJt4LesZkru1P_hiFSoBUH6gZ530mU
