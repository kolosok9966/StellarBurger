import { describe, it, expect, beforeEach } from 'vitest';

import {
  feedOrdersSlice,
  wsFeedOrdersConnecting,
  wsFeedOrdersOpen,
  wsFeedOrdersClose,
  wsFeedOrdersError,
  wsFeedOrdersMessage,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedStatus,
  getFeedLastDoneOrders,
  getFeedLastPendingOrders,
  getFeedConnectionError,
  getFeedReceivedMessage,
} from '@/services/feed-orders/reducer';
import { WebsocketStatus, type OrdersState, type TOrdersResponse } from '@/utils/types';

describe('feedOrdersSlice', () => {
  let initialState: OrdersState;

  const mockOrdersResponse: TOrdersResponse = {
    success: true,
    orders: [
      {
        _id: '1',
        number: 12345,
        name: 'Заказ 1',
        status: 'done',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        ingredients: ['ingredient1', 'ingredient2'],
      },
      {
        _id: '2',
        number: 12346,
        name: 'Заказ 2',
        status: 'pending',
        createdAt: '2024-01-01T12:30:00Z',
        updatedAt: '2024-01-01T12:30:00Z',
        ingredients: ['ingredient3'],
      },
      {
        _id: '3',
        number: 12347,
        name: 'Заказ 3',
        status: 'done',
        createdAt: '2024-01-01T13:00:00Z',
        updatedAt: '2024-01-01T13:00:00Z',
        ingredients: ['ingredient4', 'ingredient5'],
      },
      {
        _id: '4',
        number: 12348,
        name: 'Заказ 4',
        status: 'created',
        createdAt: '2024-01-01T13:30:00Z',
        updatedAt: '2024-01-01T13:30:00Z',
        ingredients: ['ingredient6'],
      },
      {
        _id: '5',
        number: 12349,
        name: 'Заказ 5',
        status: 'done',
        createdAt: '2024-01-01T14:00:00Z',
        updatedAt: '2024-01-01T14:00:00Z',
        ingredients: ['ingredient7', 'ingredient8'],
      },
      {
        _id: '6',
        number: 12350,
        name: 'Заказ 6',
        status: 'done',
        createdAt: '2024-01-01T14:30:00Z',
        updatedAt: '2024-01-01T14:30:00Z',
        ingredients: ['ingredient9'],
      },
      {
        _id: '7',
        number: 12351,
        name: 'Заказ 7',
        status: 'done',
        createdAt: '2024-01-01T15:00:00Z',
        updatedAt: '2024-01-01T15:00:00Z',
        ingredients: ['ingredient10'],
      },
      {
        _id: '8',
        number: 12352,
        name: 'Заказ 8',
        status: 'pending',
        createdAt: '2024-01-01T15:30:00Z',
        updatedAt: '2024-01-01T15:30:00Z',
        ingredients: ['ingredient11'],
      },
      {
        _id: '9',
        number: 12353,
        name: 'Заказ 9',
        status: 'pending',
        createdAt: '2024-01-01T16:00:00Z',
        updatedAt: '2024-01-01T16:00:00Z',
        ingredients: ['ingredient12'],
      },
      {
        _id: '10',
        number: 12354,
        name: 'Заказ 10',
        status: 'done',
        createdAt: '2024-01-01T16:30:00Z',
        updatedAt: '2024-01-01T16:30:00Z',
        ingredients: ['ingredient13'],
      },
    ],
    total: 100,
    totalToday: 10,
  };

  beforeEach(() => {
    initialState = {
      status: WebsocketStatus.OFFLINE,
      orders: [],
      total: 0,
      totalToday: 0,
      receivedMessage: false,
      connectionError: null,
    };
  });

  it('should return initial state', () => {
    expect(feedOrdersSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('wsFeedOrdersConnecting should set status to CONNECTING', () => {
      const action = wsFeedOrdersConnecting();
      const newState = feedOrdersSlice.reducer(initialState, action);

      expect(newState.status).toBe(WebsocketStatus.CONNECTING);
      expect(newState.connectionError).toBeNull();
      expect(newState.orders).toEqual([]);
    });

    it('wsFeedOrdersOpen should set status to ONLINE and clear error', () => {
      const stateWithError = {
        ...initialState,
        status: WebsocketStatus.CONNECTING,
        connectionError: 'Some error',
      };

      const action = wsFeedOrdersOpen();
      const newState = feedOrdersSlice.reducer(stateWithError, action);

      expect(newState.status).toBe(WebsocketStatus.ONLINE);
      expect(newState.connectionError).toBeNull();
    });

    it('wsFeedOrdersClose should set status to OFFLINE and reset receivedMessage', () => {
      const stateWithMessage = {
        ...initialState,
        status: WebsocketStatus.ONLINE,
        receivedMessage: true,
        orders: mockOrdersResponse.orders,
      };

      const action = wsFeedOrdersClose();
      const newState = feedOrdersSlice.reducer(stateWithMessage, action);

      expect(newState.status).toBe(WebsocketStatus.OFFLINE);
      expect(newState.receivedMessage).toBe(false);
      // Остальные данные должны сохраниться
      expect(newState.orders).toEqual(mockOrdersResponse.orders);
    });

    it('wsFeedOrdersError should set connection error', () => {
      const errorMessage = 'WebSocket connection failed';
      const action = wsFeedOrdersError(errorMessage);
      const newState = feedOrdersSlice.reducer(initialState, action);

      expect(newState.connectionError).toBe(errorMessage);
      expect(newState.status).toBe(WebsocketStatus.OFFLINE);
    });

    it('wsFeedOrdersMessage should update orders and stats', () => {
      const action = wsFeedOrdersMessage(mockOrdersResponse);
      const newState = feedOrdersSlice.reducer(initialState, action);

      expect(newState.receivedMessage).toBe(true);
      expect(newState.orders).toEqual(mockOrdersResponse.orders);
      expect(newState.total).toBe(mockOrdersResponse.total);
      expect(newState.totalToday).toBe(mockOrdersResponse.totalToday);
    });

    it('wsFeedOrdersMessage should handle missing total/totalToday', () => {
      const responseWithoutTotals = {
        ...mockOrdersResponse,
        total: undefined,
        totalToday: undefined,
      };
      const action = wsFeedOrdersMessage(responseWithoutTotals as TOrdersResponse);
      const newState = feedOrdersSlice.reducer(initialState, action);

      expect(newState.total).toBe(0);
      expect(newState.totalToday).toBe(0);
    });

    it('wsFeedOrdersMessage should replace existing orders with new ones', () => {
      // Сначала устанавливаем одни заказы
      const firstAction = wsFeedOrdersMessage(mockOrdersResponse);
      const stateWithOrders = feedOrdersSlice.reducer(initialState, firstAction);

      // Затем новые заказы
      const newOrdersResponse = {
        ...mockOrdersResponse,
        orders: [mockOrdersResponse.orders[0]], // Только первый заказ
      };
      const secondAction = wsFeedOrdersMessage(newOrdersResponse);
      const newState = feedOrdersSlice.reducer(stateWithOrders, secondAction);

      expect(newState.orders).toHaveLength(1);
      expect(newState.orders[0]).toEqual(mockOrdersResponse.orders[0]);
    });
  });

  describe('selectors', () => {
    let stateWithOrders: OrdersState;

    beforeEach(() => {
      stateWithOrders = {
        status: WebsocketStatus.ONLINE,
        orders: mockOrdersResponse.orders,
        total: mockOrdersResponse?.total ?? 0,
        totalToday: mockOrdersResponse?.totalToday ?? 0,
        receivedMessage: true,
        connectionError: null,
      };
    });

    it('getFeedOrders should return all orders', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedOrders(state)).toEqual(mockOrdersResponse.orders);
    });

    it('getFeedTotal should return total', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedTotal(state)).toBe(mockOrdersResponse.total);
    });

    it('getFeedTotalToday should return totalToday', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedTotalToday(state)).toBe(mockOrdersResponse.totalToday);
    });

    it('getFeedStatus should return current status', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedStatus(state)).toBe(WebsocketStatus.ONLINE);
    });

    it('getFeedConnectionError should return error', () => {
      const stateWithError = {
        feedOrders: { ...stateWithOrders, connectionError: 'Test error' },
      };
      expect(getFeedConnectionError(stateWithError)).toBe('Test error');
    });

    it('getFeedConnectionError should return null when no error', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedConnectionError(state)).toBeNull();
    });

    it('getFeedReceivedMessage should return receivedMessage flag', () => {
      const state = { feedOrders: stateWithOrders };
      expect(getFeedReceivedMessage(state)).toBe(true);
    });

    describe('getFeedLastDoneOrders', () => {
      it('should return last 10 done orders numbers', () => {
        const state = { feedOrders: stateWithOrders };
        const result = getFeedLastDoneOrders(state);

        // Должны быть только заказы со статусом 'done'
        expect(result).toHaveLength(6); // В моке 6 заказов со статусом done
        expect(result).toEqual([12345, 12347, 12349, 12350, 12351, 12354]);
      });

      it('should return empty array when no done orders', () => {
        const stateWithoutDone = {
          feedOrders: {
            ...stateWithOrders,
            orders: mockOrdersResponse.orders.filter((o) => o.status !== 'done'),
          },
        };
        const result = getFeedLastDoneOrders(stateWithoutDone);
        expect(result).toEqual([]);
      });

      it('should limit to 10 items', () => {
        // Создаем 15 done заказов
        const manyDoneOrders = Array.from({ length: 15 }, (_, i) => ({
          ...mockOrdersResponse.orders[0],
          _id: String(i + 1),
          number: 10000 + i,
          status: 'done' as const,
        }));

        const stateWithManyDone = {
          feedOrders: {
            ...stateWithOrders,
            orders: manyDoneOrders,
          },
        };

        const result = getFeedLastDoneOrders(stateWithManyDone);
        expect(result).toHaveLength(10);
      });
    });

    describe('getFeedLastPendingOrders', () => {
      it('should return last 20 pending/created orders numbers', () => {
        const state = { feedOrders: stateWithOrders };
        const result = getFeedLastPendingOrders(state);

        // Должны быть заказы со статусом 'pending' или 'created'
        expect(result).toHaveLength(4);
        expect(result).toEqual([12346, 12348, 12352, 12353]);
      });

      it('should return empty array when no pending/created orders', () => {
        const stateWithoutPending = {
          feedOrders: {
            ...stateWithOrders,
            orders: mockOrdersResponse.orders.filter((o) => o.status === 'done'),
          },
        };
        const result = getFeedLastPendingOrders(stateWithoutPending);
        expect(result).toEqual([]);
      });

      it('should limit to 20 items', () => {
        // Создаем 25 pending заказов
        const manyPendingOrders = Array.from({ length: 25 }, (_, i) => ({
          ...mockOrdersResponse.orders[1],
          _id: String(i + 1),
          number: 20000 + i,
          status: 'pending' as const,
        }));

        const stateWithManyPending = {
          feedOrders: {
            ...stateWithOrders,
            orders: manyPendingOrders,
          },
        };

        const result = getFeedLastPendingOrders(stateWithManyPending);
        expect(result).toHaveLength(20);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty orders array in message', () => {
      const emptyResponse = {
        ...mockOrdersResponse,
        orders: [],
      };
      const action = wsFeedOrdersMessage(emptyResponse);
      const newState = feedOrdersSlice.reducer(initialState, action);

      expect(newState.orders).toEqual([]);
      expect(newState.receivedMessage).toBe(true);
    });

    it('should preserve other state properties when updating', () => {
      const stateWithStatus = {
        ...initialState,
        status: WebsocketStatus.CONNECTING,
      };

      const action = wsFeedOrdersMessage(mockOrdersResponse);
      const newState = feedOrdersSlice.reducer(stateWithStatus, action);

      // Status не должен измениться при получении сообщения
      expect(newState.status).toBe(WebsocketStatus.CONNECTING);
      expect(newState.orders).toEqual(mockOrdersResponse.orders);
    });
  });
});
