import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Пользователь не найден');
const serverError = new ServerError('Произошла ошибка сервера');
const badRequestError = new BadRequestError('Некорректные данные для пользователя.');
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const unauthorizedError = new UnauthorizedError('Ошибка авторизации');
const UniqueErrorCode = 11000;

export function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(serverError));
}

export function getUserById(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(err);
      }
    });// данные не записались, вернём ошибку
}

export function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((userDocument) => {
      const user = userDocument.toObject();
      delete user.password;
      // console.log('user ', user);
      res.send({ data: user });
    })// вернём записанные в базу данные
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === UniqueErrorCode) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });
}

export function updateUserInfo(req, res, next) {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });// данные не записались, вернём ошибку
}

export function updateAvatar(req, res, next) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });// данные не записались, вернём ошибку
}

export function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(() => next(unauthorizedError));// ошибка аутентификации
}

export function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(err);
      }
    });// данные не записались, вернём ошибку
}
