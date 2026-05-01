import express from 'express';
import { registerClient, getClients } from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { clientRegistrationSchema } from '../validators/client.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', requireAuth, getClients);
router.post('/register', requireAuth, validate(clientRegistrationSchema), registerClient);

export default router;