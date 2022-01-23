const express = require('express');
const LoginUser = require('./controllers/post-login');
const CreateUser = require('./controllers/post-new-user');

const router = express.Router();

router.post('/login', LoginUser);
router.post('/register', CreateUser);

module.exports = router;