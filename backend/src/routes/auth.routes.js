const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * Registro de usuário
 * POST /auth/register
 * Body: { username, email, password, role? }
 */
router.post('/register', authController.register);

/**
 * Login de usuário
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', authController.login);

module.exports = router;