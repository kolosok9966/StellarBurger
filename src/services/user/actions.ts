import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

import type {
  User,
  RegisterPayload,
  LoginPayload,
  UpdateUserPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
  UserResponse,
} from '@/utils/types';

const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
  document.cookie = `accessToken=${accessToken.split('Bearer ')[1]}; path=/`;
};

const clearTokens = (): void => {
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0; path=/';
};

export const registerUser = createAsyncThunk<User, RegisterPayload>(
  'user/register',
  async ({ email, password, name }) => {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk<User, LoginPayload>(
  'user/login',
  async ({ email, password }) => {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  const token = localStorage.getItem('refreshToken');

  await request('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  clearTokens();
});

export const getUser = createAsyncThunk<User>('user/get', async () => {
  const res = await request<UserResponse>('/auth/user');
  return res.user;
});

export const updateUser = createAsyncThunk<User, UpdateUserPayload>(
  'user/update',
  async ({ email, name, password }) => {
    const res = await request<UserResponse>('/auth/user', {
      method: 'PATCH',
      body: JSON.stringify({ email, name, password }),
    });

    return res.user;
  }
);

export const forgotPassword = createAsyncThunk<void, ForgotPasswordPayload>(
  'user/forgotPassword',
  async ({ email }) => {
    await request('/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
);

export const resetPassword = createAsyncThunk<void, ResetPasswordPayload>(
  'user/resetPassword',
  async ({ password, token }) => {
    await request('/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });
  }
);
