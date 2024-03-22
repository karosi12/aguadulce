import { Response, Request } from 'express'
import bcrypt from 'bcryptjs'
import * as JWT from 'jsonwebtoken'
import { IRequest } from '../models/user.interface'
import { responsesHelper } from '../utils/responses'
import { IUsers } from '../models/user.interface'
import { Users } from '../models/user'
import { Logger } from '../logger/logger'
import { Config } from '../config/config'
import { userSchema } from '../utils/schemaValidation/user'
import { handleMongooseError } from '../utils/validation'
const logging = new Logger()
const logger = logging.log('user-service')

class UserController {
  /**
   * create
   * @desc users should be able to create a new account
   * Route: POST: '/api/v1/register'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async create(req: Request, res: Response) {
    try {
      const { error } = userSchema.validate(req.body)
      if (error) {
        return res
          .status(400)
          .send(responsesHelper.error(400, `${error.message}`))
      } else {
        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)
        req.body.password = hash
        const data: IUsers = req.body
        const user = await Users.create(data)
        return res
          .status(201)
          .send(
            responsesHelper.success(201, user, 'user was successfully created'),
          )
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error to login user ${JSON.stringify(error.message)}`)
        const { status, message } = handleMongooseError(error)
        return res.status(status).send(responsesHelper.error(status, message))
      }
    }
  }
  /**
   * login
   * @desc As a register users you should be able login
   * Route: POST: '/api/v1/login'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async login(req: Request, res: Response) {
    try {
      const config = new Config()
      const { cookieOptions } = config
      const { JWT_SECRET, TOKEN_EXPIRES_IN } = config.JwtCredentials()
      const email = req.body.email
      if (!req.body.email)
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Email is required'))
      if (!req.body.password)
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Password is required'))
      const user = await Users.findOne({ email })
      if (!user)
        return res.status(400).send(responsesHelper.error(400, 'Wrong email'))
      const match = bcrypt.compareSync(req.body.password, user.password)
      if (!match)
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Wrong password'))
      const jwtPayload = { id: user._id }
      const token = await JWT.sign(jwtPayload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRES_IN,
      })
      res.cookie('cookieId', token, cookieOptions)
      return res
        .status(200)
        .send(
          responsesHelper.success(200, {}, 'You have successfully logged in'),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error to login user ${JSON.stringify(error)}`)
        const { status, message } = handleMongooseError(error)
        return res.status(status).send(responsesHelper.error(status, message))
      }
    }
  }
  /**
   * view
   * @desc authenticated user should be able to get his/her details
   * Route: GET: '/api/v1/user'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async view(req: IRequest, res: Response) {
    try {
      const id = req.decoded?.id
      const user = await Users.findById(id)
      if (!user)
        return res
          .status(400)
          .send(responsesHelper.error(400, 'unable to get user'))
      return res
        .status(200)
        .send(
          responsesHelper.success(200, user, 'user was successfully fetched'),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `error occured unable to view user details ${JSON.stringify(error)}`,
        )
        const { status, message } = handleMongooseError(error)
        return res.status(status).send(responsesHelper.error(status, message))
      }
    }
  }
  /**
   * logout
   * @desc As a logged in user you should be able logout
   * Route: POST: '/api/v1/logout'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async logout(req: IRequest, res: Response) {
    try {
      const {
        headers: { cookie },
      } = req
      if (cookie) {
        res.cookie('cookieId', '')
        return res
          .status(200)
          .send(responsesHelper.success(200, {}, 'Logged out successfully'))
      }
      return res
        .status(204)
        .send(responsesHelper.success(204, {}, 'Go to login page'))
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `error occured unable to logout user ${JSON.stringify(error)}`,
        )
        const { status, message } = handleMongooseError(error)
        return res.status(status).send(responsesHelper.error(status, message))
      }
    }
  }
}

export const userController = new UserController()
