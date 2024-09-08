const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

router.get('/auth', authCtrl.showAuthPage);
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

module.exports = router;