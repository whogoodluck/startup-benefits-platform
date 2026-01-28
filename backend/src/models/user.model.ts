import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from '../types'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    companyName: {
      type: String,
      trim: true,
      default: undefined,
    },
    website: {
      type: String,
      trim: true,
      default: undefined,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verificationRequestedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.set('toJSON', {
  transform: (_document: Document, returnedObject: Record<string, any>): void => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

userSchema.methods.toSafeObject = function (): Partial<IUser> {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model<IUser>('User', userSchema)

export default User
