// import { find, findById, create, findByIdAndUpdate } from '../models/user.js';
// const User = require('../models/user');
import { constants } from 'http2';
import { User } from '../models/user.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Некорректные данные пользователя. ${message}`,
  });

const responseServerError = (res, message) => res
.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
.send({
  message: `На сервере произошла ошибка. ${message}`,
});

const responseNotFound = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${message}`,
  });

export function getAllUsers(req, res) {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export function getUserById(req, res) {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        responseNotFound(res, 'Пользователь не найден');
      } else {
        res.send(user);
      };
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.HTTP_STATUS_BAD_REQUESTmessage);
      }
    });// данные не записались, вернём ошибку
}

export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.HTTP_STATUS_BAD_REQUESTmessage);
      }
    });// данные не записались, вернём ошибку
}

export function updateUserInfo(req, res) {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true // если пользователь не найден, он будет создан
  })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.HTTP_STATUS_BAD_REQUESTmessage);
      }
    });// данные не записались, вернём ошибку
}

export function updateAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}