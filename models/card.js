import { Schema, ObjectId, model } from 'mongoose';
import { Joi } from 'celebrate';

// const cardSchema = Joi.object({
//   name: Joi.string()
//     .min(2)
//     .max(30)
//     .required(),

//   link: Joi.link()
//     .required(),
//   owner: Joi.string()
//     .required(),
//   likes: Joi.string()
//     .default([]),
//   createdAt: Joi.date()
//     .default(Date.now),
// }, { versionKey: false });

const cardSchema = new Schema({
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
    type: ObjectId,
    required: true,
  },
  likes: [{
    type: ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export const Card = model('Card', cardSchema);
