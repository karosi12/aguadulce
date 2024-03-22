import express, { Application, Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { Logger } from './logger/logger'
import { Config } from './config/config'
const app: Application = express()
dotenv.config()
const config = new Config()
const { requiredVariables } = config
const logging = new Logger()
const logger = logging.log('server')
const API_VERSION = `/api/${requiredVariables.API_VERSION}`

app.use(cors())
app.disable('x-powered-by')
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send({ message: 'API is running fine' })
})

app.listen(requiredVariables.PORT, () =>
  logger.info(`server running on ${requiredVariables.PORT}`),
)
