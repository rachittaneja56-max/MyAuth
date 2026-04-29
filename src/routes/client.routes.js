import express from 'express';
import { registerClient } from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { clientRegistrationSchema } from '../validators/client.validator.js';

const router = express.Router();

router.post('/register', validate(clientRegistrationSchema), registerClient);

export default router;