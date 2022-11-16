import { Router } from 'express';
import {
  getAllCards, createCard, deleteCard, likeCard, disLikeCard,
} from '../controllers/cards.js';

import {
  celebrateBodyCard,
  celebrateBodyCardId
} from '../validators/cards.js';

const cardRoutes = Router();

cardRoutes.get('/', getAllCards);
cardRoutes.post('/', celebrateBodyCard, createCard);
cardRoutes.delete('/:id', celebrateBodyCardId, deleteCard);
cardRoutes.put('/:id/likes', celebrateBodyCardId, likeCard);
cardRoutes.delete('/:id/likes', celebrateBodyCardId, disLikeCard);

export default cardRoutes;
