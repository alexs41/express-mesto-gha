import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index.js';

const unauthorizedError = new UnauthorizedError('Ошибка авторизации');

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(unauthorizedError);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(unauthorizedError);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return '';
}
