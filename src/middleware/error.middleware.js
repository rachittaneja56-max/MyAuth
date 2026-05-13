import { AppError } from '../utils/errors.js';

const TOKEN_PATH = '/api/auth/token';

function mapToOAuthTokenError(err) {
  if (err instanceof AppError) {
    const { message, code, statusCode } = err;
    if (code === 'INVALID_CLIENT') {
      return { status: 401, body: { error: 'invalid_client', error_description: message } };
    }
    if (code === 'INVALID_GRANT') {
      return { status: 400, body: { error: 'invalid_grant', error_description: message } };
    }
    if (code === 'UNSUPPORTED_GRANT_TYPE') {
      return { status: 400, body: { error: 'unsupported_grant_type', error_description: message } };
    }
    if (statusCode === 401) {
      return { status: 401, body: { error: 'invalid_client', error_description: message } };
    }
    if (statusCode === 400) {
      return { status: 400, body: { error: 'invalid_request', error_description: message } };
    }
    return { status: statusCode || 400, body: { error: 'invalid_request', error_description: message } };
  }
  return {
    status: 500,
    body: { error: 'server_error', error_description: 'Internal Server Error' },
  };
}

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const pathOnly = (req.originalUrl || req.url || '').split('?')[0];
  const isTokenPost = pathOnly === TOKEN_PATH && req.method === 'POST';
  if (isTokenPost) {
    const { status, body } = mapToOAuthTokenError(err);
    if (!(err instanceof AppError)) {
      console.error('[OIDC token error]', err?.message, err?.stack);
    }
    return res.status(status).json(body);
  }

  const isJwks = pathOnly.endsWith('/.well-known/jwks.json');
  if (isJwks) {
    console.error('[OIDC JWKS error]', err?.message, err?.stack);
    return res.status(500).json({
      error: 'server_error',
      error_description: err?.message || 'Failed to load signing keys',
    });
  }

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else {
    console.error('[OIDC Unhandled Error]:', err?.message, err?.stack);
  }

  const payload = {
    success: false,
    error: message,
    message,
  };
  if (err instanceof AppError) {
    payload.data = { code };
  }
  return res.status(statusCode).json(payload);
};
