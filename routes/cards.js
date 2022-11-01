import { Router } from 'express';
import { getAllCards, createCard, deleteCard, likeCard, disLikeCard } from '../controllers/cards.js';
const cardRoutes = Router();
// import { json } from 'body-parser';
// const jsonParser = json();

cardRoutes.get('/', getAllCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', disLikeCard);

// router.post('/', jsonParser, createCard);
// router.put('/:cardId/likes', jsonParser, likeCard);

export default cardRoutes;