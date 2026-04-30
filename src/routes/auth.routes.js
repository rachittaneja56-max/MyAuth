import express from 'express';
import { authorizeClient } from '../controllers/auth.controller.js';
import { validateQuery } from '../middleware/validate.middleware.js';
import { authorizeQuerySchema } from '../middleware/auth.validator.js';

const router = express.Router();

router.get('/authorize', validateQuery(authorizeQuerySchema), authorizeClient);

export default router;