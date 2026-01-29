import { checkResponse } from './checkResponse';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getCookie = (name) => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/+\\^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`;
};

const refreshToken = async () => {
  const token = localStorage.getItem('refreshToken');

  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).then(checkResponse);

  setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
  localStorage.setItem('refreshToken', res.refreshToken);
};

export const request = async (endpoint, options = {}) => {
  const accessToken = getCookie('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    await refreshToken();

    const newAccessToken = getCookie('accessToken');

    const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });

    return checkResponse(retryRes);
  }

  return checkResponse(res);
};
