import * as express from 'express'
import { userController } from '../controllers/user'
import { authenticate } from '../middlewares/authenticate'

const router = express.Router()

router.post('/register', userController.create)
router.post('/login', userController.login)
router.get('/user', authenticate, userController.view)
router.delete('/logout', authenticate, userController.logout)

export const usersRoute = router
