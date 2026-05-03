import { prisma } from '../config/db.js';
import { UnauthorizedError } from '../utils/errors.js';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

export const requireAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      throw new UnauthorizedError('Session expired or missing. Please log in again.', 'UNAUTHORIZED');
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie('sessionId', COOKIE_OPTIONS);
      throw new UnauthorizedError('Session expired or invalid.', 'UNAUTHORIZED');
    }

    req.sessionId = session.id;
    req.user = session.user;

    next();
  } catch (error) {
    console.error("[OIDC requireAuth] Auth check failed:", error.message);
    next(error);
  }
};
