const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log(decoded); // Log the decoded token
        next();
    } catch (error) {
        console.error(error); // Log any verification errors
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};
