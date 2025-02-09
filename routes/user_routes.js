const express = require('express');
const { body } = require('express-validator'); // Import express-validator
const router = express.Router();
const userController = require('./../controllers/user_controller.js');

// Validation middleware
const validateUserForm = [
  body('username').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation for creating a new account
const validateCreateAccount = [
  body('username').isLength({min:4}).withMessage('Invalid Username'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
];

// Validation for editing a user
const validateEditUser = [
  body('username').optional().isEmail().withMessage('Invalid email address'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/profile/edit', validateEditUser, userController.EditUser);
router.post('/profile/delete', body('userId').notEmpty().withMessage('User ID is required'), userController.DeleteUser);
router.post('/login', validateUserForm, userController.Login);
router.post('/create_account', validateCreateAccount, userController.CreateAccount);
router.get('/logout', userController.Logout);

module.exports = router;
