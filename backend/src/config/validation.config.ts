import * as Joi from 'joi';
import { ENVIRONMENT } from '../common';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(ENVIRONMENT.DEVELOPMENT, ENVIRONMENT.PRODUCTION, ENVIRONMENT.TEST)
    .default(ENVIRONMENT.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  MONGO_HOST: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_DB_NAME: Joi.string().required(),
  MONGO_USER: Joi.string().required(),
  MONGO_PASSWORD: Joi.string().required(),
});