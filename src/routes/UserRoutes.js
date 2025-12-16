const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user-controllers');

// GET semua user
router.get('/users', UserController.getAllUsers);

// Tambah user (admin)
router.post('/users', UserController.createUser);

// Login user
router.post('/login', UserController.login);

module.exports = router;
