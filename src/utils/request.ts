import { checkResponse } from './checkResponse';

import type { RefreshTokenResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/+\\^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value}`;
};

export const refreshToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('refreshToken');

  if (!token) return false;

  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) return false;

  const data: RefreshTokenResponse = await res.json();

  if (!data.accessToken) return false;

  setCookie('accessToken', data.accessToken.split('Bearer ')[1]);
  localStorage.setItem('refreshToken', data.refreshToken);

  return true;
};

export const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const accessToken = getCookie('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  let res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      throw new Error('Unauthorized');
    }

    const newAccessToken = getCookie('accessToken');

    if (!newAccessToken) {
      throw new Error('No access token after refresh');
    }

    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return checkResponse(res);
};
