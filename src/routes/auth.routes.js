import express from 'express';
import { authorizeClient, signupUser, loginUser } from '../controllers/auth.controller.js';
import { validateQuery, validate } from '../middleware/validate.middleware.js';
import { authorizeQuerySchema, signupSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.get('/authorize', validateQuery(authorizeQuerySchema), authorizeClient)
router.post('/signup', validate(signupSchema), signupUser)
router.post('/login', validate(loginSchema), loginUser)

export default router;