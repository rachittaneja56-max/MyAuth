import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/client.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/clients', clientRoutes);


app.use(errorHandler);

export default app;