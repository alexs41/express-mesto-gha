// import { find, findById, create, findByIdAndUpdate } from '../models/user.js';
// const User = require('../models/user');
import { constants } from 'http2';
import { User } from '../models/user.js';

export function getAllUsers(req, res) {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export function getUserById(req, res) {
  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
}

export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));// данные не записались, вернём ошибку
}

export function updateUserInfo(req, res) {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true // если пользователь не найден, он будет создан
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

export function updateAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}