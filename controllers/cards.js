// import { constants } from 'http2';
import { Card } from '../models/card.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../utils/utils.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  ForbiddenError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Запрашиваемый пользователь не найден');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const UniqueErrorCode = 11000;
const forbiddenError = new ForbiddenError('Эту карточку нельзя удалить, карточка другого пользователя');

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

// export const deleteCard = async (req, res) => {
//   try {
//     const card = await Card.findById(req.params.id);
//     if (!card) {
//       responseNotFound(res, 'Карточка не найдена');
//     } else if (card.owner !== req.user._id) {
//       forbiddenError(res);
//     } else {
//       res.send(await Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id }));
//     }
//   }
//   catch (err) {
//     if (err.name === 'ValidationError' || err.name === 'CastError') {
//       responseBadRequestError(res);
//     } else {
//       responseServerError(res);
//     }
//   }
// }

export function deleteCard(req, res, next) {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        responseNotFound(res, 'Карточка не найдена');
      } else if (card.owner != req.user._id) {
        console.log('card.owner ', card.owner);
        console.log('req.user._id ', req.user._id);
        console.log("result ", card.owner != req.user._id);

        throw forbiddenError;
      } else {
        Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
          .then((card) => ((!card) ? responseNotFound(res, 'Карточка не найдена, или это не карточка другого пользователя') : res.send(card)))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              responseBadRequestError(res);
            } else {
              responseServerError(res);
            }
          });// данные не записались, вернём ошибку
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
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
