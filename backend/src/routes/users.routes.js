const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

/**
 * Criar novo usuário (somente admins podem criar)
 * POST /users
 * Body: { username, email, password, role? }
 */
router.post('/', authenticate, authorizeRoles('ADMIN'), usersController.createUser);

module.exports = router;