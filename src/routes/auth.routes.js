import express from 'express';
import {
  authorizeClient,
  signupUser,
  loginUser,
  submitConsent,
  exchangeToken,
  getMe,
  logoutUser,
  userInfo,
} from '../controllers/auth.controller.js';
import { validateQuery, validate } from '../middleware/validate.middleware.js';
import {
  authorizeQuerySchema,
  signupSchema,
  loginSchema,
  consentSchema,
  tokenSchema,
} from '../validators/auth.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { loginPostLimiter, signupPostLimiter, tokenPostLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.get('/me', requireAuth, getMe);
router.get('/userinfo', userInfo);
router.get('/authorize', validateQuery(authorizeQuerySchema), authorizeClient);
router.post('/signup', signupPostLimiter, validate(signupSchema), signupUser);
router.post('/login', loginPostLimiter, validate(loginSchema), loginUser);
router.post('/consent', requireAuth, validate(consentSchema), submitConsent);
router.post('/token', tokenPostLimiter, validate(tokenSchema), exchangeToken);
router.get('/logout', logoutUser);

export default router;
