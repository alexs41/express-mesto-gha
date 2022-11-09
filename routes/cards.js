import { Router } from 'express';
import {
  getAllCards, createCard, deleteCard, likeCard, disLikeCard,
} from '../controllers/cards.js';

const cardRoutes = Router();

cardRoutes.get('/', getAllCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', disLikeCard);

export default cardRoutes;
