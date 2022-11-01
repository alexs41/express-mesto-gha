const express = require('express');
const controller = require('../controllers/users');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', controller.getAllUsers);
router.get('/:userId', controller.getUserById);
router.post('/', jsonParser, controller.createUser);
router.patch('/me', jsonParser, controller.updateUserInfo);
router.patch('/me/avatar', jsonParser, controller.updateAvatar);

module.exports = router;