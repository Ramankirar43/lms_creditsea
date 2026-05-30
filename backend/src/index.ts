import cors from 'cors';
import express from 'express';
import path from 'path';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { errorMiddleware } from './middleware/errorMiddleware';
import routes from './routes';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), env.uploadDir)),
  );

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'LMS API is running' });
  });

  app.use('/api', routes);
  app.use(errorMiddleware);

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
