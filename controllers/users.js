import { User } from '../models/user.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../utils/utils.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

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
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: hash,
     }))
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

export function login (req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
      req.cookies.jwt = token;
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

export function getCurrentUser(req, res) {
  User.findById(req.user._id)
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