import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import clientRoutes from './routes/client.routes.js';
import discoveryRoutes from './routes/discovery.routes.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser())

app.use('/api/clients', clientRoutes);
app.use('/', discoveryRoutes)
app.use('/api/auth', authRoutes)

const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get(/^.*$/, (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/.well-known')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.use(errorHandler);

export default app;