import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemaObjectId,
  schemaURL,
} from './common.js';

const schemaRouteMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  schemaObjectId,
).required();

const schemaName = Joi.string().min(2).max(30).required();
const schemaLink = schemaURL.required();

const schemaCard = Joi.object({
  name: schemaName,
  link: schemaLink,
}).required();

const segmentBodyCard = { [Segments.BODY]: schemaCard };

export const celebrateBodyCard = celebrate(segmentBodyCard);
