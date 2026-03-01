import { describe, it, expect, beforeEach } from 'vitest';

import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
} from '@/services/user/actions';
import {
  userSlice,
  getUserData,
  getUserLoading,
  getUserError,
  getIsAuthChecked,
} from '@/services/user/reducer';

import type { User } from '@/utils/types';

describe('userSlice', () => {
  let initialState: ReturnType<typeof userSlice.reducer>;

  const mockUser: User = {
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockUpdatedUser: User = {
    email: 'updated@example.com',
    name: 'Updated User',
  };

  beforeEach(() => {
    initialState = {
      user: null,
      loading: false,
      error: false,
      isAuthChecked: false,
    };
  });

  it('should return initial state', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('selectors', () => {
    let rootState: { user: typeof initialState };

    beforeEach(() => {
      rootState = {
        user: {
          user: mockUser,
          loading: false,
          error: false,
          isAuthChecked: true,
        },
      };
    });

    it('getUserData should return user', () => {
      expect(getUserData(rootState)).toEqual(mockUser);
    });

    it('getUserData should return null when no user', () => {
      const emptyState = { user: { ...initialState } };
      expect(getUserData(emptyState)).toBeNull();
    });

    it('getUserLoading should return loading state', () => {
      expect(getUserLoading(rootState)).toBe(false);

      const loadingState = { user: { ...initialState, loading: true } };
      expect(getUserLoading(loadingState)).toBe(true);
    });

    it('getUserError should return error state', () => {
      expect(getUserError(rootState)).toBe(false);

      const errorState = { user: { ...initialState, error: true } };
      expect(getUserError(errorState)).toBe(true);
    });

    it('getIsAuthChecked should return auth checked state', () => {
      expect(getIsAuthChecked(rootState)).toBe(true);

      const uncheckedState = { user: { ...initialState, isAuthChecked: false } };
      expect(getIsAuthChecked(uncheckedState)).toBe(false);
    });
  });

  describe('extraReducers', () => {
    describe('registerUser', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: registerUser.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should set user and auth checked', () => {
        const action = {
          type: registerUser.fulfilled.type,
          payload: mockUser,
        };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(mockUser);
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('rejected should set error true', () => {
        const action = { type: registerUser.rejected.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
      });
    });

    describe('loginUser', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: loginUser.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should set user and auth checked', () => {
        const action = {
          type: loginUser.fulfilled.type,
          payload: mockUser,
        };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(mockUser);
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('rejected should set error true', () => {
        const action = { type: loginUser.rejected.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
      });
    });

    describe('getUser', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: getUser.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should set user and auth checked', () => {
        const action = {
          type: getUser.fulfilled.type,
          payload: mockUser,
        };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(mockUser);
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('rejected should set auth checked and clear user', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthChecked: false,
        };

        const action = { type: getUser.rejected.type };
        const newState = userSlice.reducer(stateWithUser, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toBeNull();
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });
    });

    describe('updateUser', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: updateUser.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should update user', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
        };

        const action = {
          type: updateUser.fulfilled.type,
          payload: mockUpdatedUser,
        };
        const newState = userSlice.reducer(stateWithUser, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(mockUpdatedUser);
        expect(newState.error).toBe(false);
      });

      it('rejected should set error true', () => {
        const action = { type: updateUser.rejected.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
      });
    });

    describe('logoutUser', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: logoutUser.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should clear user and set auth checked', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthChecked: true,
        };

        const action = { type: logoutUser.fulfilled.type };
        const newState = userSlice.reducer(stateWithUser, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toBeNull();
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('rejected should clear user and set auth checked', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthChecked: true,
        };

        const action = { type: logoutUser.rejected.type };
        const newState = userSlice.reducer(stateWithUser, action);

        expect(newState.loading).toBe(false);
        expect(newState.user).toBeNull();
        expect(newState.isAuthChecked).toBe(true);
        expect(newState.error).toBe(false);
      });
    });

    describe('forgotPassword', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: forgotPassword.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should set loading false', () => {
        const stateWithLoading = {
          ...initialState,
          loading: true,
        };

        const action = { type: forgotPassword.fulfilled.type };
        const newState = userSlice.reducer(stateWithLoading, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(false);
      });

      it('rejected should set error true', () => {
        const action = { type: forgotPassword.rejected.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
      });
    });

    describe('resetPassword', () => {
      it('pending should set loading true and error false', () => {
        const action = { type: resetPassword.pending.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
      });

      it('fulfilled should set loading false', () => {
        const stateWithLoading = {
          ...initialState,
          loading: true,
        };

        const action = { type: resetPassword.fulfilled.type };
        const newState = userSlice.reducer(stateWithLoading, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(false);
      });

      it('rejected should set error true', () => {
        const action = { type: resetPassword.rejected.type };
        const newState = userSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
      });
    });
  });

  describe('complex scenarios', () => {
    it('should handle full auth flow', () => {
      // Начальное состояние
      let state = { ...initialState };

      // Регистрация
      state = userSlice.reducer(state, { type: registerUser.pending.type });
      expect(state.loading).toBe(true);

      state = userSlice.reducer(state, {
        type: registerUser.fulfilled.type,
        payload: mockUser,
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // Обновление профиля
      state = userSlice.reducer(state, { type: updateUser.pending.type });
      expect(state.loading).toBe(true);

      state = userSlice.reducer(state, {
        type: updateUser.fulfilled.type,
        payload: mockUpdatedUser,
      });
      expect(state.user).toEqual(mockUpdatedUser);

      // Выход
      state = userSlice.reducer(state, { type: logoutUser.fulfilled.type });
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
