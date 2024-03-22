import { MongoError } from 'mongodb'

export function validateEnvVariables(
  requiredVariables: string[],
): Record<string, string> {
  const envValues: Record<string, string> = {}
  // Check each required variable
  for (const variable of requiredVariables) {
    const value = process.env[variable]
    if (!value) {
      throw new Error(`Required environment variable ${variable} is missing`)
    }
    envValues[variable] = value
  }

  return envValues
}

export function handleMongooseError(error: Error): {
  status: number
  message: string
} {
  let status = 500
  let message = 'Internal server error'
  if (error.name === 'ValidationError') {
    status = 400
    message = 'Validation failed'
  } else if (error instanceof MongoError && error.code === 11000) {
    status = 409
    message = 'Duplicate key error'
  }

  return { status, message }
}
