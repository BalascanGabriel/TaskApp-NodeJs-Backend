const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address');
            }
        },
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain 'password'");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        },
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define possible roles
        default: 'user',
    },
    avatar: {
        type: Buffer,
        default: null,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
