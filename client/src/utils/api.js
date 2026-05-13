export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function errorAlertClass(err) {
  if (err instanceof ApiError && (err.status === 429 || err.status === 403)) {
    return 'px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-100 text-sm leading-relaxed';
  }
  return 'px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm leading-relaxed';
}

const api = async (endpoint, { method = 'GET', body, headers = {} } = {}) => {
  const config = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);
  const text = await response.text();
  let parsed = {};
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new ApiError(text.slice(0, 200) || 'Invalid response', { status: response.status });
    }
  }

  const pathOnly = endpoint.split('?')[0];
  const isTokenEndpoint = pathOnly.endsWith('/api/auth/token');

  if (isTokenEndpoint) {
    if (!response.ok) {
      const msg = parsed.error_description || parsed.error || 'Token request failed';
      throw new ApiError(msg, { status: response.status, code: parsed.error });
    }
    return parsed;
  }

  if (response.status === 429) {
    const msg =
      typeof parsed.error === 'string'
        ? parsed.error
        : parsed.message || 'Too many requests. Please wait a few minutes and try again.';
    throw new ApiError(msg, { status: 429, code: 'RATE_LIMIT' });
  }

  if (!response.ok) {
    const msg =
      typeof parsed.error === 'string'
        ? parsed.error
        : parsed.message || 'Something went wrong';
    const code = parsed.data?.code;
    throw new ApiError(msg, { status: response.status, code });
  }

  if (parsed.success === false) {
    const msg =
      typeof parsed.error === 'string'
        ? parsed.error
        : parsed.message || 'Request failed';
    throw new ApiError(msg, { status: response.status, code: parsed.data?.code });
  }

  return parsed;
};

export default api;
