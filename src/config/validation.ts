import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    APP_NAME: Joi.string().default('Nest App'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri().optional(),
    DB_HOST: Joi.string().optional(),
    DB_PORT: Joi.number().optional(),
    DB_USER: Joi.string().optional(),
    DB_PASS: Joi.string().optional(),
    DB_NAME: Joi.string().optional(),
});
