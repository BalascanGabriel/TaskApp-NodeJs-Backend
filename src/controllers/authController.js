const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const userExists = async (email) => {
    return await User.findOne({ email });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: 'Email already in use',
                token: null, // Set token to null or remove it if you don't want to include it on failure
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = generateToken(user._id);

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        res.json({
            code: 200,
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            code: 500,
            message: 'Error creating user',
            token: null, // Set token to null or remove it if you don't want to include it on failure
        });
    }
};
