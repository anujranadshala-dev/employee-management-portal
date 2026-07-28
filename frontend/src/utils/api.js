const API_BASE_URL = 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = async (url, options = {}) => {
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && !options.isRetry) {
    // If a token refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(url, { ...options, isRetry: true })) // Retry the request after token is refreshed
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    if (!isRefreshing) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (!refreshResponse.ok) throw new Error('Refresh token failed');
        processQueue(null);
        return api(url, { ...options, isRetry: true }); // Retry the original request
      } catch (error) {
        processQueue(error);
        // Handle failed refresh (e.g., redirect to login)
        window.location.href = '/';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred');
  }

  return response;
};