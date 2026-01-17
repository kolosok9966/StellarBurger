import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('refreshToken', refreshToken);
  document.cookie = `accessToken=${accessToken.split('Bearer ')[1]}; path=/`;
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0; path=/';
};

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async ({ email, password }) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  saveTokens(res.accessToken, res.refreshToken);
  return res.user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const token = localStorage.getItem('refreshToken');

  await request('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  clearTokens();
});

export const getUser = createAsyncThunk('user/get', async () => {
  const res = await request('/auth/user');
  return res.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ email, name, password }) => {
    const res = await request('/auth/user', {
      method: 'PATCH',
      body: JSON.stringify({ email, name, password }),
    });

    return res.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }) => {
    const res = await request('/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return res;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ password, token }) => {
    const res = await request('/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });

    return res;
  }
);
