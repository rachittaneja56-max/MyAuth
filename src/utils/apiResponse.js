export function sendSuccess(res, statusCode, { message, data } = {}) {
  const body = { success: true };
  if (message !== undefined) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

export function sendFailure(res, statusCode, error, { message, data } = {}) {
  const body = { success: false, error };
  if (message !== undefined) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}
