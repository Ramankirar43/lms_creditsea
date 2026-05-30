import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

export async function connectDatabase(): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(env.mongodbUri);
      console.log('MongoDB connected');
      return;
    } catch (error) {
      lastError = error as Error;
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, lastError.message);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  console.error(
    '\nCould not connect to MongoDB. Check MONGODB_URI in backend/.env.\n' +
      '- Local dev: mongodb://localhost:27017/lms (start MongoDB or run: docker compose up -d mongo)\n' +
      '- Atlas: whitelist your IP in Atlas Network Access and use ...mongodb.net/lms\n',
  );
  throw lastError;
}
