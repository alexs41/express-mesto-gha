import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { responseBadRequestError, responseServerError } from '../utils/utils.js';
import { User } from '../models/user.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Пользователь не найден');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const UniqueErrorCode = 11000;

export function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(buildErrorServer(err.message)));
}

export function getUserById(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
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
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
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
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
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
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });// данные не записались, вернём ошибку
}

export function login(req, res) {
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
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });// данные не записались, вернём ошибку
}

export const readOne = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw notFoundError;
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
};
