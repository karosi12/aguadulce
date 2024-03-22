import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { Config } from '../config/config'
import { Logger } from '../logger/logger'

export class DB {
  private MONGO_HOST: string
  private MONGO_PORT: number
  private MONGO_DB_NAME: string
  private MONGO_USERNAME: string
  private MONGO_PASSWORD: string
  public logger: any

  constructor() {
    const logging = new Logger()
    const config = new Config()
    this.logger = logging.log('db-service')
    this.MONGO_HOST = config.MongoDBCredentials().MONGO_HOST
    this.MONGO_PORT = config.MongoDBCredentials().MONGO_PORT
    this.MONGO_DB_NAME = config.MongoDBCredentials().MONGO_DB_NAME
    this.MONGO_USERNAME = config.MongoDBCredentials().MONGO_USERNAME
    this.MONGO_PASSWORD = config.MongoDBCredentials().MONGO_PASSWORD
  }

  public connect() {
    const connectionString =
      !this.MONGO_USERNAME || !this.MONGO_PASSWORD
        ? `mongodb://${this.MONGO_HOST}:${this.MONGO_PORT}/${this.MONGO_DB_NAME}`
        : `mongodb://${this.MONGO_USERNAME}:${this.MONGO_PASSWORD}@${this.MONGO_HOST}:${this.MONGO_PORT}/${this.MONGO_DB_NAME}`
    mongoose.Promise = bluebird
    if (process.env.NODE_ENV === 'development') {
      const mongo = mongoose.connect(connectionString)
      mongo
        .then((data) => {
          this.logger.info(
            `MongoDB Connection Established on development. DB path ${connectionString}`,
          )
        })
        .catch((err) => {
          this.logger.error('Unable to connect to MongoDB', err)
        })
      return mongo
    } else {
      const mongo = mongoose.connect(connectionString)
      mongo
        .then((data) => {
          this.logger.info(
            `MongoDB Connection Established on ${process.env.NODE_ENV}. DB path ${connectionString}`,
          )
        })
        .catch((err) => {
          this.logger.error('Unable to connect to MongoDB', err.message)
        })
      return mongo
    }
  }
}
