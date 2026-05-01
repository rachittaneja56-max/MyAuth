import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clientRoutes from './routes/client.routes.js';
import discoveryRoutes from './routes/discovery.routes.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use('/api/clients', clientRoutes);
app.use('/', discoveryRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler);

export default app;