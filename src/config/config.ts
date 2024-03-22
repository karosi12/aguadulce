import { Logger } from '../logger/logger'
import { validateEnvVariables } from '../utils/validation'

export class Config {
  requiredVariableList: string[] = [
    'JWT_SECRET',
    'TOKEN_EXPIRES_IN',
    'PORT',
    'API_VERSION',
    'REDIS_HOST',
    'REDIS_PORT',
  ]
  requiredVariables = {
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
    PORT: process.env.PORT,
    API_VERSION: process.env.API_VERSION,
  }
  public logger: any
  public cookieOptions = {
    maxAge: 20 * 60 * 1000, // would expire in 20minutes
    httpOnly: process.env.NODE_ENV === 'production' ? true : false,
  }
  constructor() {
    const logging = new Logger()
    this.logger = logging.log('db-service')
  }
  public MongoDBCredentials(): any {
    const MONGO_HOST = process.env.MONGO_HOST
    const MONGO_PORT = process.env.MONGO_PORT
    const MONGO_DB_NAME = process.env.MONGO_DB_NAME
    const MONGO_USERNAME = process.env.MONGO_USERNAME
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD

    return {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB_NAME,
      MONGO_USERNAME,
      MONGO_PASSWORD,
    }
  }
  public RedisCredentials(): any {
    return {
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
    }
  }
  public JwtCredentials(): Record<string, string> {
    try {
      const { JWT_SECRET, TOKEN_EXPIRES_IN } = validateEnvVariables(
        this.requiredVariableList,
      )
      return { JWT_SECRET, TOKEN_EXPIRES_IN }
    } catch (err) {
      const error = err as Error
      this.logger.error(error.message)
      process.exit(1)
    }
  }
}
