import express from 'express';
import { authorizeClient, signupUser, loginUser } from '../controllers/auth.controller.js';
import { validateQuery, validate } from '../middleware/validate.middleware.js';
import { authorizeQuerySchema, signupSchema, loginSchema } from '../validators/auth.validator.js';
import { submitConsent } from '../controllers/auth.controller.js';
import { consentSchema } from '../validators/auth.validator.js';
import { exchangeToken, getMe } from '../controllers/auth.controller.js';
import { tokenSchema } from '../validators/auth.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/me', requireAuth, getMe);
router.get('/authorize', validateQuery(authorizeQuerySchema), authorizeClient)
router.post('/signup', validate(signupSchema), signupUser)
router.post('/login', validate(loginSchema), loginUser)
router.post('/consent', requireAuth, validate(consentSchema), submitConsent)
router.post('/token', validate(tokenSchema), exchangeToken);

export default router;