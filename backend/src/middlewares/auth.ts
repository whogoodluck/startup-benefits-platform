import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { AuthRequest, IJWTPayload } from '../types'
import { HttpError } from '../utils/http-error'

export const authenticateToken = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      throw new HttpError(401, 'Access token is required')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJWTPayload

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      throw new HttpError(401, 'Invalid or expired token')
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export const requireVerified = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new HttpError(401, 'Authentication required.')
  }

  if (!req.user.isVerified) {
    throw new HttpError(403, 'Access denied. Account verification required.')
  }

  next()
}

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new HttpError(401, 'Authentication required.')
  }

  if (req.user.role !== 'admin') {
    throw new HttpError(403, 'Access denied. Admin privileges required.')
  }

  next()
}
