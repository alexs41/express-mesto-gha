// models/user.js
const db = require('../db');

const cardSchema = new db.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: db.ObjectId,
    required: true,
  },
  likes: [{ // описываем схему для одного элемента и заключаем её в квадратные скобки
    type: db.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = db.model('Card', cardSchema);