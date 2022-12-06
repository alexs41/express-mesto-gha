import express from 'express';
import { constants } from 'http2';
import { connect, disconnect } from 'mongoose';
import { errors } from 'celebrate';
import bodyParser from 'body-parser';
//------------------------------------
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js';
import auth from './middlewares/auth.js';
import { login, createUser } from './controllers/users.js';

import {
  NotFoundError,
} from './errors/NotFoundError.js';

import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from './validators/users.js';

import { requestLogger, errorLogger } from './middlewares/logger.js';

const { PORT = 3000 } = process.env;
const notFoundError = new NotFoundError('Страницы не существует');
//------------------------------------
export const run = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser()); // подключаем парсер кук как мидлвэр

  connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB!!!');
  });

  app.use(requestLogger); // подключаем логгер запросов

  app.post('/signin', celebrateBodyAuth, login);
  app.post('/signup', celebrateBodyUser, createUser);

  // авторизация
  app.use(auth);

  app.use('/users', userRoutes);
  app.use('/cards', cardRoutes);

  app.use(errorLogger); // подключаем логгер ошибок
  app.all('/*', () => {
    throw notFoundError;
  });
  app.use(errors()); // обработчик ошибок celebrate
  app.use((err, req, res, next) => {
    const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const message = err.message || 'Неизвестная ошибка';
    res.status(status).send({ message });
    next();
  });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
  });

  const stop = async () => {
    await disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
