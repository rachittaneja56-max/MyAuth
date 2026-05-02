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

// Required for secure cookies behind Render/Cloudflare load balancers
app.set('trust proxy', 1);

app.use(express.json());

// These endpoints must allow all origins for external OAuth clients
const openEndpoints = ['/api/auth/token', '/api/auth/logout'];
openEndpoints.forEach(ep => app.use(ep, cors()));

const strictCors = cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
});

app.use((req, res, next) => {
  if (openEndpoints.includes(req.path)) {
    return next();
  }
  strictCors(req, res, next);
});
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