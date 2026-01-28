import express from 'express'
import authController from '../controllers/user.controller'
import { authenticateToken } from '../middlewares/auth'

const userRouter = express.Router()

userRouter.post('/register', authController.register)
userRouter.post('/login', authController.login)
userRouter.get('/me', authenticateToken, authController.getCurrentUser)
userRouter.post('/request-verification', authenticateToken, authController.requestVerification)

export default userRouter
