import { Router } from 'express'
import userRouter from './user.route'

const router = Router()

router.get('/', (_req, res) => {
  res.send('Hello World!')
})

router.use('/users/auth', userRouter)

export default router
