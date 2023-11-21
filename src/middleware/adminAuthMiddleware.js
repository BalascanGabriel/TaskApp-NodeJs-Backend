const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.userId;

        // Check if the user has admin role
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin rights required' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};
