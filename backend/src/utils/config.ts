import { config } from 'dotenv'

config()

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env.PORT || 3001

const MONGO_URI = process.env.MONGO_URI

const JWT_SECRET = process.env.JWT_SECRET

export default {
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET,
}
