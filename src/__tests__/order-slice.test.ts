import { describe, it, expect, beforeEach } from 'vitest';

import { createOrder, fetchOrderIfNeeded } from '@/services/order/actions';
import {
  orderSlice,
  clearOrder,
  getOrderNumber,
  getOrder,
  getOrderLoading,
  getOrderError,
} from '@/services/order/reducer';

import type { TOrder } from '@/utils/types';

describe('orderSlice', () => {
  let initialState: ReturnType<typeof orderSlice.reducer>;

  const mockOrder: TOrder = {
    _id: '123',
    number: 12345,
    name: 'Тестовый заказ',
    status: 'done',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    ingredients: ['ingredient1', 'ingredient2'],
  };

  beforeEach(() => {
    initialState = {
      order: null,
      loading: false,
      error: false,
    };
  });

  it('should return initial state', () => {
    expect(orderSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('reducers', () => {
    describe('clearOrder', () => {
      it('should clear order and reset loading/error', () => {
        const stateWithOrder = {
          order: mockOrder,
          loading: true,
          error: false,
        };

        const action = clearOrder();
        const newState = orderSlice.reducer(stateWithOrder, action);

        expect(newState).toEqual(initialState);
      });

      it('should do nothing when state is already empty', () => {
        const action = clearOrder();
        const newState = orderSlice.reducer(initialState, action);

        expect(newState).toEqual(initialState);
      });
    });
  });

  describe('extraReducers', () => {
    describe('createOrder', () => {
      it('pending should set loading true and clear order/error', () => {
        const stateWithData = {
          order: mockOrder,
          loading: false,
          error: false,
        };

        const action = { type: createOrder.pending.type };
        const newState = orderSlice.reducer(stateWithData, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
        expect(newState.order).toBeNull();
      });

      it('fulfilled should set order and loading false', () => {
        const action = {
          type: createOrder.fulfilled.type,
          payload: mockOrder,
        };
        const newState = orderSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(false);
        expect(newState.order).toEqual(mockOrder);
      });

      it('rejected should set error true and loading false', () => {
        const stateWithLoading = {
          order: null,
          loading: true,
          error: false,
        };

        const action = { type: createOrder.rejected.type };
        const newState = orderSlice.reducer(stateWithLoading, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
        expect(newState.order).toBeNull();
      });
    });

    describe('fetchOrderIfNeeded', () => {
      it('pending should set loading true and clear order/error', () => {
        const stateWithData = {
          order: mockOrder,
          loading: false,
          error: false,
        };

        const action = { type: fetchOrderIfNeeded.pending.type };
        const newState = orderSlice.reducer(stateWithData, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
        expect(newState.order).toBeNull();
      });

      it('fulfilled should set order and loading false', () => {
        const action = {
          type: fetchOrderIfNeeded.fulfilled.type,
          payload: mockOrder,
        };
        const newState = orderSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(false);
        expect(newState.order).toEqual(mockOrder);
      });

      it('rejected should set error true and loading false', () => {
        const stateWithLoading = {
          order: null,
          loading: true,
          error: false,
        };

        const action = { type: fetchOrderIfNeeded.rejected.type };
        const newState = orderSlice.reducer(stateWithLoading, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
        expect(newState.order).toBeNull();
      });
    });
  });

  describe('selectors', () => {
    let rootState: { order: typeof initialState };

    beforeEach(() => {
      rootState = {
        order: {
          order: mockOrder,
          loading: false,
          error: false,
        },
      };
    });

    it('getOrderNumber should return order number', () => {
      expect(getOrderNumber(rootState)).toBe(mockOrder.number);
    });

    it('getOrderNumber should return undefined when no order', () => {
      const emptyState = { order: { ...initialState } };
      expect(getOrderNumber(emptyState)).toBeUndefined();
    });

    it('getOrder should return full order', () => {
      expect(getOrder(rootState)).toEqual(mockOrder);
    });

    it('getOrder should return null when no order', () => {
      const emptyState = { order: { ...initialState } };
      expect(getOrder(emptyState)).toBeNull();
    });

    it('getOrderLoading should return loading state', () => {
      expect(getOrderLoading(rootState)).toBe(false);

      const loadingState = { order: { ...initialState, loading: true } };
      expect(getOrderLoading(loadingState)).toBe(true);
    });

    it('getOrderError should return error state', () => {
      expect(getOrderError(rootState)).toBe(false);

      const errorState = { order: { ...initialState, error: true } };
      expect(getOrderError(errorState)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple actions in sequence', () => {
      // Начало создания заказа
      let state = orderSlice.reducer(initialState, { type: createOrder.pending.type });
      expect(state).toEqual({
        order: null,
        loading: true,
        error: false,
      });

      // Успешное создание заказа
      state = orderSlice.reducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder,
      });
      expect(state).toEqual({
        order: mockOrder,
        loading: false,
        error: false,
      });

      // Очистка заказа
      state = orderSlice.reducer(state, clearOrder());
      expect(state).toEqual(initialState);

      // Ошибка при получении заказа
      state = orderSlice.reducer(state, { type: fetchOrderIfNeeded.rejected.type });
      expect(state).toEqual({
        order: null,
        loading: false,
        error: true,
      });
    });
  });
});
