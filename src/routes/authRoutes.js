// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for user login
router.post('/login', authController.login);

// Route for user signup
router.post('/signup', authController.signup);

// Example protected route - requires authentication middleware
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

module.exports = router;
