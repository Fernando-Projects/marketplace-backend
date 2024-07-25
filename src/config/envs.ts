import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  PG_HOST:string;
  PG_PORT:number;
  PG_USER:string;
  PG_PASS:string;
  PG_DATABASE:string;
  TOKEN_SECRET_KEY:string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    PG_HOST: joi.string().required(),
    PG_PORT: joi.number().required(),
    PG_USER: joi.string().required(),
    PG_PASS: joi.string().required(),
    PG_DATABASE: joi.string().required(),
    TOKEN_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = { port: envVars.PORT, databaseUrl: envVars.DATABASE_URL, pgHost: envVars.PG_HOST, pgPort: envVars.PG_PORT, pgUser: envVars.PG_USER, pgPass: envVars.PG_PASS, pgDatabase: envVars.PG_DATABASE, tokenSecretKey: envVars.TOKEN_SECRET_KEY };