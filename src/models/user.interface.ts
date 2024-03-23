import { Request } from 'express'
export interface IUsers {
  fullName: string
  email: string
  password: string
  phoneNumber?: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IRequest extends Request {
  decoded?: {
    id?: string
  }
}
