// import { find, create, findByIdAndRemove, findByIdAndUpdate } from '../models/card.js';
import { Card } from '../models/card.js'

export function getAllCards(req, res) {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner})
    .then(card => res.send({ data: card }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка, карточка не создана' }));// данные не записались, вернём ошибку
}

export function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка удаления карточки' }));
}

export function likeCard(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },// обработчик then получит на вход обновлённую запись
  )
    .then(card => res.send({ data: card }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));// данные не записались, вернём ошибку
}

export function disLikeCard(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка удаления карточки' }));
}

