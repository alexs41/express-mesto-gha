import { User } from '../models/user.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../utils/utils.js';

export function getAllUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => responseServerError(res));
}

export function getUserById(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        responseNotFound(res, 'Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}

export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}

export function updateUserInfo(req, res) {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}

export function updateAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });// данные не записались, вернём ошибку
}
