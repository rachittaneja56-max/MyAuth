import { prisma } from '../config/db.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
export const authorizeClient = async (req, res) => {
  const { client_id, redirect_uri } = req.query;

  const client = await prisma.client.findUnique({
    where: { clientId: client_id },
    select: { redirectUris: true }
  });

  if (!client) {
    throw new UnauthorizedError('Invalid client_id', 'INVALID_CLIENT');
  }

  if (!client.redirectUris.includes(redirect_uri)) {
    throw new BadRequestError('redirect_uri does not match any registered URIs for this client', 'INVALID_REDIRECT_URI');
  }

  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    const clientOrigin = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
    const loginUrl = new URL(`${clientOrigin}/login`);
    loginUrl.search = new URLSearchParams(req.query).toString();
    return res.redirect(302, loginUrl.toString());
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    res.clearCookie('sessionId');
    const clientOrigin = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
    const loginUrl = new URL(`${clientOrigin}/login`);
    loginUrl.search = new URLSearchParams(req.query).toString();
    return res.redirect(302, loginUrl.toString());
  }

  // Check if user has already granted consent to this client
  const existingConsent = await prisma.consent.findUnique({
    where: {
      userId_clientId: {
        userId: session.userId,
        clientId: client_id
      }
    }
  });

  if (existingConsent) {
    // True SSO: Skip consent screen and generate auth code
    const authCode = crypto.randomBytes(32).toString('hex');
    const codeExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.authCode.create({
      data: {
        code: authCode,
        clientId: client_id,
        userId: session.userId,
        codeChallenge: req.query.code_challenge,
        expiresAt: codeExpiry
      }
    });

    const finalRedirectUrl = new URL(redirect_uri);
    finalRedirectUrl.searchParams.append('code', authCode);
    if (req.query.state) finalRedirectUrl.searchParams.append('state', req.query.state);

    return res.redirect(302, finalRedirectUrl.toString());
  }

  // No consent yet, redirect to consent screen
  const clientOrigin = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
  const consentUrl = new URL(`${clientOrigin}/consent`);
  consentUrl.search = new URLSearchParams(req.query).toString();
  return res.redirect(302, consentUrl.toString());
};


export const signupUser = async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestError('User with this email already exists', 'USER_EXISTS');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: { id: true, email: true, name: true }
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully. Please log in.',
    data: newUser
  });
};


export const loginUser = async (req, res) => {
  const { email, password, client_id, redirect_uri, response_type, code_challenge, code_challenge_method, state } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }


  const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: sessionExpiry,
    }
  });
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: sessionExpiry
  });
  if (!client_id) {
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      redirectUrl: '/'
    });
  }

  const existingConsent = await prisma.consent.findUnique({
    where: {
      userId_clientId: {
        userId: user.id,
        clientId: client_id
      }
    }
  });

  if (existingConsent) {
    const authCode = crypto.randomBytes(32).toString('hex');
    const codeExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.authCode.create({
      data: {
        code: authCode,
        clientId: client_id,
        userId: user.id,
        codeChallenge: code_challenge,
        expiresAt: codeExpiry
      }
    });

    const finalRedirectUrl = new URL(redirect_uri);
    finalRedirectUrl.searchParams.append('code', authCode);
    if (state) finalRedirectUrl.searchParams.append('state', state);

    return res.status(200).json({
      success: true,
      message: 'Login successful, redirecting to app...',
      redirectUrl: finalRedirectUrl.toString()
    });
  }

  const clientOrigin = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
  const consentUrl = new URL(`${clientOrigin}/consent`);
  const params = { client_id, redirect_uri, response_type, code_challenge, code_challenge_method };
  if (state) params.state = state;
  consentUrl.search = new URLSearchParams(params).toString();
  return res.status(200).json({
    success: true,
    message: 'Login successful, redirecting to consent...',
    redirectUrl: consentUrl.toString()
  });
};

export const submitConsent = async (req, res) => {
  const { client_id, redirect_uri, response_type, code_challenge, code_challenge_method, state, consent_given } = req.body;

  if (!consent_given) {
    const denyUrl = new URL(redirect_uri);
    denyUrl.searchParams.append('error', 'access_denied');
    if (state) denyUrl.searchParams.append('state', state);
    return res.status(200).json({
      success: true,
      message: 'User denied access.',
      redirectUrl: denyUrl.toString()
    });
  }
  const authCode = crypto.randomBytes(32).toString('hex');
  const codeExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.consent.upsert({
    where: {
      userId_clientId: {
        userId: req.user.id,
        clientId: client_id
      }
    },
    update: {},
    create: {
      userId: req.user.id,
      clientId: client_id,
      scopes: ['openid', 'profile', 'email']
    }
  });

  await prisma.authCode.create({
    data: {
      code: authCode,
      clientId: client_id,
      userId: req.user.id,
      codeChallenge: code_challenge,
      expiresAt: codeExpiry
    }
  });
  const finalRedirectUrl = new URL(redirect_uri);
  finalRedirectUrl.searchParams.append('code', authCode);
  if (state) finalRedirectUrl.searchParams.append('state', state);
  return res.status(200).json({
    success: true,
    message: 'Consent granted. Redirecting to client...',
    redirectUrl: finalRedirectUrl.toString()
  });
};

const PRIVATE_KEY_PATH = path.resolve(process.cwd(), 'certs', 'private.pem');
let privateKey;
try {
  if (process.env.PRIVATE_KEY_BASE64) {
    privateKey = Buffer.from(process.env.PRIVATE_KEY_BASE64, 'base64').toString('utf8');
  } else if (process.env.PRIVATE_KEY) {
    privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  } else {
    privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  }
} catch (error) {
  console.error("CRITICAL: Private key not available! Set PRIVATE_KEY_BASE64 env var or place private.pem in certs/");
}

export const exchangeToken = async (req, res) => {
  const { client_id, client_secret, grant_type } = req.body;


  const client = await prisma.client.findUnique({ where: { clientId: client_id } });
  if (!client) throw new UnauthorizedError('Invalid client credentials', 'INVALID_CLIENT');

  const isClientValid = await bcrypt.compare(client_secret, client.clientSecretHash);
  if (!isClientValid) throw new UnauthorizedError('Invalid client credentials', 'INVALID_CLIENT');


  if (grant_type === 'authorization_code') {
    const { code, redirect_uri, code_verifier } = req.body;

    const authCodeRecord = await prisma.authCode.findUnique({
      where: { code },
      include: { user: true }
    });

    if (!authCodeRecord || authCodeRecord.expiresAt < new Date()) {
      throw new BadRequestError('Invalid or expired authorization code', 'INVALID_GRANT');
    }


    const hashedVerifier = crypto.createHash('sha256').update(code_verifier).digest('base64url');
    if (hashedVerifier !== authCodeRecord.codeChallenge) {
      await prisma.authCode.delete({ where: { id: authCodeRecord.id } });
      throw new BadRequestError('PKCE verification failed.', 'INVALID_GRANT');
    }

    await prisma.authCode.delete({ where: { id: authCodeRecord.id } });

    const issuer = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const tokenPayload = { sub: authCodeRecord.userId, email: authCodeRecord.user.email, name: authCodeRecord.user.name };
    const idToken = jwt.sign(tokenPayload, privateKey, { algorithm: 'RS256', expiresIn: '1h', audience: client_id, issuer });
    const accessToken = jwt.sign({ sub: authCodeRecord.userId }, privateKey, { algorithm: 'RS256', expiresIn: '15m', audience: client_id, issuer });

    const refreshTokenString = crypto.randomBytes(40).toString('hex');
    const refreshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: authCodeRecord.userId,
        clientId: client_id,
        expiresAt: refreshExpiry,
      }
    });

    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: refreshTokenString,
      id_token: idToken
    });
  }


  if (grant_type === 'refresh_token') {
    const { refresh_token } = req.body;

    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refresh_token },
      include: { user: true }
    });

    if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid, expired, or revoked refresh token', 'INVALID_GRANT');
    }

    const issuer = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const newAccessToken = jwt.sign({ sub: dbToken.userId }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '15m',
      audience: client_id,
      issuer
    });

    return res.status(200).json({
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 900
    });
  }

  throw new BadRequestError('Unsupported grant_type', 'UNSUPPORTED_GRANT_TYPE');
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
};

export const logoutUser = async (req, res) => {
  const { client_id, post_logout_redirect_uri } = req.query;
  const sessionId = req.cookies?.sessionId;
  if (sessionId) {
    try {
      await prisma.session.delete({ where: { id: sessionId } });
    } catch (e) {

    }
  }

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  if (post_logout_redirect_uri && client_id) {
    const client = await prisma.client.findUnique({
      where: { clientId: client_id },
      select: { redirectUris: true }
    });

    if (client && client.redirectUris.includes(post_logout_redirect_uri)) {
      return res.redirect(302, post_logout_redirect_uri);
    }
  }

  const clientOrigin = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
  return res.redirect(302, clientOrigin);
};