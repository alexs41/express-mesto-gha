import { Router } from 'express';
import {
  getAllCards, createCard, deleteCard, likeCard, disLikeCard,
} from '../controllers/cards.js';

import {
  celebrateBodyCard,
  celebrateParamsCardId,
} from '../validators/cards.js';

const cardRoutes = Router();

cardRoutes.get('/', getAllCards);
cardRoutes.post('/', celebrateBodyCard, createCard);
cardRoutes.delete('/:id', celebrateParamsCardId, deleteCard);
cardRoutes.put('/:id/likes', celebrateParamsCardId, likeCard);
cardRoutes.delete('/:id/likes', celebrateParamsCardId, disLikeCard);

export default cardRoutes;
