import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { loginSchema, registerSchema } from '../schemas/user.schema'
import { AuthRequest } from '../types'
import config from '../utils/config'
import { HttpError } from '../utils/http-error'

const hashPassword = async (password: string) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET!, {
    expiresIn: '7d',
  })
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = registerSchema.parse(req.body)

    const existingUser = await User.findOne({ email: payload.email })
    if (existingUser) {
      throw new HttpError(409, 'Email already in use')
    }

    const hashedPassword = await hashPassword(payload.password)

    const user = await User.create({
      ...payload,
      password: hashedPassword,
    })

    const token = generateToken(user.id)

    const userData = user.toSafeObject()

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userData,
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = loginSchema.parse(req.body)

    const user = await User.findOne({ email: payload.email }).select('+password')

    if (!user) {
      throw new HttpError(401, 'Invalid email or password')
    }

    const isPasswordValid = await comparePassword(payload.password, user.password)

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid email or password')
    }

    const token = generateToken(user.id)

    const userData = user.toSafeObject()

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id

    const user = await User.findById(userId).select('-password')

    res.json({
      success: true,
      data: { user },
    })
  } catch (err) {
    next(err)
  }
}

const requestVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id

    const user = await User.findById(userId)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    if (user.isVerified) {
      throw new HttpError(400, 'User is already verified')
    }

    if (user.verificationStatus === 'pending') {
      throw new HttpError(400, 'Verification request already submitted')
    }

    user.verificationStatus = 'pending'
    user.verificationRequestedAt = new Date()
    await user.save()

    res.json({
      success: true,
      message: 'Verification request submitted successfully.',
      data: { user: user.toSafeObject() },
    })
  } catch (err) {
    next(err)
  }
}

export default {
  register,
  login,
  getCurrentUser,
  requestVerification,
}
