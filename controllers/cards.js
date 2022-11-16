// import { constants } from 'http2';
import { Card } from '../models/card.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../utils/utils.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Запрашиваемый пользователь не найден');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const UniqueErrorCode = 11000;

export function getAllCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
}

export function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}

export function deleteCard(req, res) {
  Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    .then((card) => ((!card) ? responseNotFound(res, 'Карточка не найдена, или это не карточка другого пользователя') : res.send(card)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку

  // Card.findByIdAndRemove(req.params.cardId)
  //   .then((card) => ((!card) ? responseNotFound(res, 'Карточка не найдена') : res.send(card)))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError' || err.name === 'CastError') {
  //       responseBadRequestError(res);
  //     } else {
  //       responseServerError(res);
  //     }
  //   });// данные не записались, вернём ошибку
}

export function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((card) => ((!card) ? responseNotFound(res, 'Карточка не найдена') : res.send({ data: card })))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}

export function disLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => ((!card) ? responseNotFound(res, 'Карточка не найдена') : res.send(card)))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}
