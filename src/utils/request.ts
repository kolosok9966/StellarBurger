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

export const refreshToken = async (): Promise<void> => {
  const token = localStorage.getItem('refreshToken');
  const res = await request<RefreshTokenResponse>('/auth/token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
  localStorage.setItem('refreshToken', res.refreshToken);
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
