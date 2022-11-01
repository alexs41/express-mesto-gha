import express from 'express';
const { PORT = 3000 } = process.env;
import { connect } from 'mongoose';
const app = express();
import bodyParser from 'body-parser';
//------------------------------------
import userRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js'
//------------------------------------
app.use(bodyParser.json());

connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
});

app.use((req, res, next) => {
  req.user = {
    _id: '635fd8104cd2ea3088cd35fe' // хардкод _id пользователя
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);// Если всё работает, консоль покажет, какой порт приложение слушает
})



