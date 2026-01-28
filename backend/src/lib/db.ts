import mongoose from 'mongoose'
import config from '../utils/config'
import logger from '../utils/logger'

export const connectDB = async () => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ error connecting to MongoDB:', err)
    process.exit(1)
  }
}
