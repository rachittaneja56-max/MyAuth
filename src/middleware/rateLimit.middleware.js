import rateLimit from 'express-rate-limit';

const windowMs = 15 * 60 * 1000;

const envelope429 = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests. Please try again shortly.',
    message: 'Too many requests. Please try again shortly.',
  });
};

const oauthToken429 = (req, res) => {
  res.status(429).json({
    error: 'invalid_request',
    error_description: 'Too many requests. Please try again later.',
  });
};

export const loginPostLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => envelope429(req, res),
});

export const signupPostLimiter = rateLimit({
  windowMs,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => envelope429(req, res),
});

export const tokenPostLimiter = rateLimit({
  windowMs,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => oauthToken429(req, res),
});
