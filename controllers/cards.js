import { Card } from '../models/card.js';
// import { responseNotFound } from '../utils/utils.js';
import {
  ServerError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Карточка не найдена');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные. ${message}`);
const forbiddenError = new ForbiddenError('Эту карточку нельзя удалить, карточка другого пользователя');

export function getAllCards(req, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest());
      } else {
        next(buildErrorServer(err.message));
      }
    });
}

export function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest());
      } else {
        next(buildErrorServer(err.message));
      }
    });// данные не записались, вернём ошибку
}

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw notFoundError;
    } else if (card.owner.toString() !== req.user._id) {
      next(forbiddenError(res));
    } else {
      res.send(await Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id }));
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(buildErrorBadRequest());
    } else {
      next(buildErrorServer(err.message));
    }
  }
};

export function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((card) => {
      if (!card) {
        next(notFoundError);
      } else {
        res.send({ data: card });
      }
    })
  // вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });// данные не записались, вернём ошибку
}

export function disLikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(notFoundError);
      } else {
        res.send({ data: card });
      }
    })
  // вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });// данные не записались, вернём ошибку
}
