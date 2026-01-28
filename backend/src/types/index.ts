import { Request } from 'express'
import { Document } from 'mongoose'

export interface AuthRequest extends Request {
  user?: IUser
}
export interface IUser extends Document {
  id: string
  name: string
  email: string
  password: string
  isVerified: boolean
  companyName?: string
  website?: string
  role: 'user' | 'admin'
  verificationStatus: 'pending' | 'approved' | 'rejected'
  verificationRequestedAt?: Date
  toSafeObject(): Partial<IUser>
}

export interface IJWTPayload {
  userId: string
  iat?: number
  exp?: number
}
