const express = require('express');
var bodyParser = require('body-parser')
const db = require('mongoose');
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
// const routes = require('./routes.js');
const User = require('./models/user');
const Card = require('./models/card');
const { PORT = 3000, BASE_PATH} = process.env;

const app = express();
const jsonParser = bodyParser.json()

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '635fd8104cd2ea3088cd35fe' // хардкода _id пользователя
  };
  next();
});

//------------------------------- USER START ---------------------------------
app.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

app.get('/users/:userId', (req, res) => {
    User.findById(req.params.userId)
      .then(user => res.send(user))
      .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
});

app.post('/users', jsonParser, (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));// данные не записались, вернём ошибку
});

app.patch('/users/me', jsonParser, (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true // если пользователь не найден, он будет создан
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
});

app.patch('/users/me/avatar', jsonParser, (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
});

//------------------------------- USER END ---------------------------------

//------------------------------- CARD START ---------------------------------
app.get('/cards', (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

app.post('/cards', jsonParser, (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  // console.log(name, ' ' , link);
  Card.create({ name, link, owner})
    .then(card => res.send({ data: card }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка, карточка не создана' }));// данные не записались, вернём ошибку
});

app.delete('/cards/:cardId', (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
      .then(card => res.send({ data: card }))
      .catch(err => res.status(500).send({ message: 'Произошла ошибка удаления карточки' }));
});

// LIKE CARD
app.put('/cards/:cardId/likes', jsonParser, (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },// обработчик then получит на вход обновлённую запись
  )
    .then(card => res.send({ data: card }))// вернём записанные в базу данные
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));// данные не записались, вернём ошибку
});
// DISLIKE CARD
app.delete('/cards/:cardId/likes', (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка удаления карточки' }));
});
//------------------------------- CARD END ---------------------------------



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);// Если всё работает, консоль покажет, какой порт приложение слушает
})



