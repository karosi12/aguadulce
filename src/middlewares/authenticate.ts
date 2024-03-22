import { Request, Response, NextFunction } from 'express'
import * as JWT from 'jsonwebtoken'
import { responsesHelper } from '../utils/responses'
import { Logger } from '../logger/logger'
import dotenv from 'dotenv'
dotenv.config()
const logging = new Logger()
const logger = logging.log('auth-service')
import { Config } from '../config/config'
const config = new Config()
const { JWT_SECRET } = config.JwtCredentials()

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.headers.cookie === undefined ? '' : req.headers.cookie
    if (!token)
      return res
        .status(400)
        .send(responsesHelper.error(400, 'Unauthorised access'))
    const cookie = token.split('=')[1] // If there is, split the cookie string to get the actual jwt token
    if (!cookie)
      return res
        .status(401)
        .send(responsesHelper.error(400, 'Unauthorised access'))
    const accessToken = cookie.split(';')[0]
    const authVerify = await JWT.verify(accessToken, JWT_SECRET)
    if (!authVerify)
      return res
        .status(401)
        .send(responsesHelper.error(400, 'token has expired'))
    // @ts-ignore
    req.decoded = authVerify
    next()
  } catch (error) {
    logger.error(`${JSON.stringify(error)}`)
    if (error instanceof Error)
      return res
        .status(500)
        .send(responsesHelper.error(500, `${error.message}`))
    if (error)
      return res
        .status(500)
        .send(
          responsesHelper.error(
            500,
            'Something went wrong about user login token',
          ),
        )
  }
}
