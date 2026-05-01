import express from 'express';
import { openIdRouter, jwksRouter } from '../controllers/discovery.controller.js';

const router = express.Router();

router.get('/.well-known/openid-configuration', openIdRouter);
router.get('/.well-known/jwks.json', jwksRouter);

export default router;