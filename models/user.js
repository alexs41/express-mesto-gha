import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { Joi } from 'celebrate';

const urlSchema = Joi
  .string()
  .url({ scheme: ['http', 'https'] })
  .required();

const nameSchema = Joi
  .string()
  .min(2)
  .max(30)
  .required();

const userSchema = new Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Жак-Ив Кусто',
    validate: {
      validator: (value) => !nameSchema.validate(value).error,
      message: () => 'Имя должно быть от 2 от 30 символов',
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: validator.isURL,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
}, { versionKey: false });

// const userSchema = new Schema({
//   name: { // у пользователя есть имя — опишем требования к имени в схеме:
//     type: String, // имя — это строка
//     minlength: 2, // минимальная длина имени — 2 символа
//     maxlength: 30, // а максимальная — 30 символов
//     default: 'Жак-Ив Кусто',
//   },
//   about: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: 'Исследователь',
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//     validate: validator.isURL,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: validator.isEmail,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//     select: false,
//   },
// }, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('email не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверный пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

export const User = model('User', userSchema);
