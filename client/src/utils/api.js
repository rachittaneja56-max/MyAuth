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
  const data = await response.json();

  if (!response.ok) {
    const msg = data?.error?.message || data?.message || 'Something went wrong';
    throw new Error(msg);
  }

  return data;
};

export default api;
