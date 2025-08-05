const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../Controllers/authentication');
const verifyToken = require('../Middleware/auth');

const registerValidation = [
    check('name', 'Name is required and must be at least 3 characters').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

router.post('/signup', registerValidation, authController.signup);

router.post('/login', loginValidation, authController.login);

router.get('/profile', verifyToken, authController.getProfile);

router.post('/logout', authController.logout);

module.exports = router;
