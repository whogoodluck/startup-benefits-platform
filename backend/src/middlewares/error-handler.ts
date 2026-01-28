import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { HttpError } from '../utils/http-error'

type ValidationError = {
  field: string
  message: string
}

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500
  let message = 'Something went wrong'
  let errors: ValidationError[] | undefined

  if (err instanceof HttpError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err instanceof ZodError) {
    statusCode = 400
    message = 'Validation failed'
    errors = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401
    message = 'Invalid or expired token'
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = 'Invalid resource ID'
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Database validation error'
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }))
  }

  if (statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}

export default errorHandler
