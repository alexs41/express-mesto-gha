import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemaObjectId,
  schemaURL,
} from './common.js';

// const schemaRouteMe = Joi.alternatives().try(
//   Joi.string().equal('me'),
//   schemaObjectId,
// ).required();

export const schemaAvatar = schemaURL;
export const schemaEmail = Joi.string().email().required();
const schemaPassword = Joi.string().required();
// необязательные поля без required
const schemaName = Joi.string().min(2).max(30);
const schemaAbout = Joi.string().min(2).max(30);

// const schemaObjectRouteMe = Joi.object({
//   id: schemaRouteMe,
// }).required();
const schemaObjectUserId = Joi.object({
  id: schemaObjectId,
}).required();
const schemaObjectProfile = Joi.object({
  name: schemaName,
  about: schemaAbout,
}).required();
const schemaObjectAvatar = Joi.object({
  avatar: schemaAvatar,
}).required();
const schemaObjectAuth = Joi.object({
  email: schemaEmail,
  password: schemaPassword,
}).required();

const schemaObjectUser = schemaObjectAuth // объединяем несколько схем в одну
  .concat(schemaObjectProfile)
  .concat(schemaObjectAvatar);

const segmentBodyAvatar = { [Segments.BODY]: schemaObjectAvatar };
const segmentBodyProfile = { [Segments.BODY]: schemaObjectProfile };
const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
const segmentParamsUserId = { [Segments.PARAMS]: schemaObjectUserId };
// const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteMe };

export const celebrateBodyAvatar = celebrate(segmentBodyAvatar);
export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsUserId = celebrate(segmentParamsUserId);
// export const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);
