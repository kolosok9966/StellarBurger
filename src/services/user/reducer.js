import { createSlice } from '@reduxjs/toolkit';

import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
} from './actions';

const initialState = {
  user: null,
  loading: false,
  error: false,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserData: (state) => state.user,
    getUserLoading: (state) => state.loading,
    getUserError: (state) => state.error,
    getIsAuthChecked: (state) => state.isAuthChecked,
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { getUserData, getUserLoading, getUserError, getIsAuthChecked } =
  userSlice.selectors;
