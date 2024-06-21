const express = require('express')
const adminController = require('../controllers/admin')
const router = express.Router();

router.post('/users', adminController.signup);
router.post('/userAuthentication', adminController.login);

module.exports = router;