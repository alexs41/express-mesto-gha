const express = require('express');
const controller = require('../controllers/cards');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/', controller.getAllCards);
router.post('/', jsonParser, controller.createCard);
router.delete('/:cardId', controller.deleteCard);
router.put('/:cardId/likes', jsonParser, controller.likeCard);
router.delete('/:cardId/likes', controller.disLikeCard);

module.exports = router;