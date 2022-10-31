const express = require('express');
var bodyParser = require('body-parser')
const db = require('mongoose');
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
// const routes = require('./routes.js');
// Слушаем 3000 порт
const User = require('./models/user');
const Card = require('./models/card');
const { PORT = 3000, BASE_PATH} = process.env;

const app = express();
const jsonParser = bodyParser.json()

app.use(express.static(path.join(__dirname, 'public')));

app.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

app.get('/users/:userId', (req, res) => {
    // res.send(req.params.userId);
    User.findById(req.params.userId)
      .then(user => res.send(user))
      .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
});

// Create a new blog post object
const user1 = new User({
  "name": "Test User",
  "about": "test profession",
  "avatar": "https://images.app.goo.gl/4HSrvZnLAvwodiBW9"
});

// Insert the article in our MongoDB database


app.post('/users', jsonParser, (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  });


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})



