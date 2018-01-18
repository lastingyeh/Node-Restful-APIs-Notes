const express = require('express');

const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

const router = express.Router();

router.post('/signup', UsersController.userSignup);

router.post('/login', UsersController.userLogin);

router.delete('/:userId', checkAuth, UsersController.userDelete);

module.exports = router;
