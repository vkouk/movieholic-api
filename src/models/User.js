const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 1
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 1
    },
    password: {
        type: String,
        minLength: 5
    },
    balance: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
};

const UsersModel = mongoose.model('users', userSchema);

module.exports = UsersModel;
