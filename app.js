import express from 'express';
import { constants } from 'http2';
import { connect, disconnect } from 'mongoose';

import bodyParser from 'body-parser';
//------------------------------------
import userRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js';
import auth from './middlewares/auth.js';
import { login, createUser } from './controllers/users.js';
import cookieParser from 'cookie-parser';

const { PORT = 3000 } = process.env;
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

  // app.use((req, res, next) => {
  //   req.user = {
  //     _id: '635fd8104cd2ea3088cd35fe', // хардкод _id пользователя
  //   };
  //   next();
  // });

  app.post('/signin', login);
  app.post('/signup', createUser);

  // авторизация
  app.use(auth);

  app.use('/users', userRoutes);
  app.use('/cards', cardRoutes);

  app.use((req, res, next) => {
    res.status(constants.HTTP_STATUS_NOT_FOUND)
      .send({ message: 'Страница не найдена. Ошибка 404.' });
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
