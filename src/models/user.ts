import { Document, Model, model, Schema } from 'mongoose'
import { IUsers } from './user.interface'

export interface IUsermodel extends IUsers, Document {}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'fullName must be at least 3 characters long'],
      maxlength: [30, 'fullName cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}
export const Users: Model<IUsermodel> = model<IUsermodel>('Users', userSchema)
