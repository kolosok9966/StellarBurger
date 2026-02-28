import { describe, it, expect, beforeEach } from 'vitest';

import {
  profileOrdersSlice,
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersClose,
  wsProfileOrdersError,
  wsProfileOrdersMessage,
  getProfileOrders,
  getProfileTotal,
  getProfileTotalToday,
  getProfileStatus,
  getProfileConnectionError,
  getProfileReceivedMessage,
} from '@/services/profile-orders/reducer';
import { WebsocketStatus, type OrdersState, type TOrdersResponse } from '@/utils/types';

describe('profileOrdersSlice', () => {
  let initialState: OrdersState;

  const mockOrdersResponse: TOrdersResponse = {
    success: true,
    orders: [
      {
        _id: '1',
        number: 12345,
        name: 'Заказ 1',
        status: 'done',
        createdAt: '2024-01-01T14:00:00Z',
        updatedAt: '2024-01-01T14:00:00Z',
        ingredients: ['ingredient1', 'ingredient2'],
      },
      {
        _id: '2',
        number: 12346,
        name: 'Заказ 2',
        status: 'pending',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
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
      connectionError: null,
      receivedMessage: false,
    };
  });

  it('should return initial state', () => {
    expect(profileOrdersSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('wsProfileOrdersConnecting should set status to CONNECTING', () => {
      const action = wsProfileOrdersConnecting();
      const newState = profileOrdersSlice.reducer(initialState, action);

      expect(newState.status).toBe(WebsocketStatus.CONNECTING);
      expect(newState.connectionError).toBeNull();
      expect(newState.orders).toEqual([]);
    });

    it('wsProfileOrdersOpen should set status to ONLINE and clear error', () => {
      const stateWithError = {
        ...initialState,
        status: WebsocketStatus.CONNECTING,
        connectionError: 'Some error',
      };

      const action = wsProfileOrdersOpen();
      const newState = profileOrdersSlice.reducer(stateWithError, action);

      expect(newState.status).toBe(WebsocketStatus.ONLINE);
      expect(newState.connectionError).toBeNull();
    });

    it('wsProfileOrdersClose should set status to OFFLINE and reset receivedMessage', () => {
      const stateWithMessage = {
        ...initialState,
        status: WebsocketStatus.ONLINE,
        receivedMessage: true,
        orders: mockOrdersResponse.orders,
      };

      const action = wsProfileOrdersClose();
      const newState = profileOrdersSlice.reducer(stateWithMessage, action);

      expect(newState.status).toBe(WebsocketStatus.OFFLINE);
      expect(newState.receivedMessage).toBe(false);
      expect(newState.orders).toEqual(mockOrdersResponse.orders); // orders сохраняются
    });

    it('wsProfileOrdersError should set connection error', () => {
      const errorMessage = 'WebSocket connection failed';
      const action = wsProfileOrdersError(errorMessage);
      const newState = profileOrdersSlice.reducer(initialState, action);

      expect(newState.connectionError).toBe(errorMessage);
      expect(newState.status).toBe(WebsocketStatus.OFFLINE);
    });

    describe('wsProfileOrdersMessage', () => {
      it('should update orders (sorted by date desc) and stats', () => {
        const action = wsProfileOrdersMessage(mockOrdersResponse);
        const newState = profileOrdersSlice.reducer(initialState, action);

        expect(newState.receivedMessage).toBe(true);
        expect(newState.total).toBe(mockOrdersResponse.total);
        expect(newState.totalToday).toBe(mockOrdersResponse.totalToday);

        // Проверяем сортировку по дате (от новых к старым)
        expect(newState.orders[0]._id).toBe('1'); // 14:00
        expect(newState.orders[1]._id).toBe('3'); // 13:00
        expect(newState.orders[2]._id).toBe('2'); // 12:00
      });

      it('should handle missing total/totalToday', () => {
        const responseWithoutTotals = {
          ...mockOrdersResponse,
          total: undefined,
          totalToday: undefined,
        };
        const action = wsProfileOrdersMessage(responseWithoutTotals as TOrdersResponse);
        const newState = profileOrdersSlice.reducer(initialState, action);

        expect(newState.total).toBe(0);
        expect(newState.totalToday).toBe(0);
      });

      it('should sort orders correctly with same dates', () => {
        const sameDateResponse = {
          ...mockOrdersResponse,
          orders: [
            {
              ...mockOrdersResponse.orders[0],
              _id: 'a',
              createdAt: '2024-01-01T12:00:00Z',
            },
            {
              ...mockOrdersResponse.orders[0],
              _id: 'b',
              createdAt: '2024-01-01T12:00:00Z',
            },
          ],
        };

        const action = wsProfileOrdersMessage(sameDateResponse);
        const newState = profileOrdersSlice.reducer(initialState, action);

        // Порядок может быть любым, но сортировка должна быть стабильной
        expect(newState.orders).toHaveLength(2);
      });

      it('should handle empty orders array', () => {
        const emptyResponse = {
          ...mockOrdersResponse,
          orders: [],
        };
        const action = wsProfileOrdersMessage(emptyResponse);
        const newState = profileOrdersSlice.reducer(initialState, action);

        expect(newState.orders).toEqual([]);
        expect(newState.receivedMessage).toBe(true);
      });
    });
  });

  describe('selectors', () => {
    let rootState: { profileOrders: OrdersState };
    let stateWithOrders: OrdersState;

    beforeEach(() => {
      stateWithOrders = {
        status: WebsocketStatus.ONLINE,
        orders: mockOrdersResponse.orders,
        total: mockOrdersResponse.total ?? 0,
        totalToday: mockOrdersResponse.totalToday ?? 0,
        connectionError: null,
        receivedMessage: true,
      };

      rootState = {
        profileOrders: stateWithOrders,
      };
    });

    it('getProfileOrders should return all orders', () => {
      expect(getProfileOrders(rootState)).toEqual(mockOrdersResponse.orders);
    });

    it('getProfileOrders should return empty array when no orders', () => {
      const emptyState = { profileOrders: { ...initialState } };
      expect(getProfileOrders(emptyState)).toEqual([]);
    });

    it('getProfileTotal should return total', () => {
      expect(getProfileTotal(rootState)).toBe(mockOrdersResponse.total);
    });

    it('getProfileTotalToday should return totalToday', () => {
      expect(getProfileTotalToday(rootState)).toBe(mockOrdersResponse.totalToday);
    });

    it('getProfileStatus should return current status', () => {
      expect(getProfileStatus(rootState)).toBe(WebsocketStatus.ONLINE);

      const offlineState = { profileOrders: { ...initialState } };
      expect(getProfileStatus(offlineState)).toBe(WebsocketStatus.OFFLINE);
    });

    it('getProfileConnectionError should return error', () => {
      const errorState = {
        profileOrders: { ...stateWithOrders, connectionError: 'Test error' },
      };
      expect(getProfileConnectionError(errorState)).toBe('Test error');
    });

    it('getProfileConnectionError should return null when no error', () => {
      expect(getProfileConnectionError(rootState)).toBeNull();
    });

    it('getProfileReceivedMessage should return receivedMessage flag', () => {
      expect(getProfileReceivedMessage(rootState)).toBe(true);

      const noMessageState = { profileOrders: { ...initialState } };
      expect(getProfileReceivedMessage(noMessageState)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple actions in sequence', () => {
      // Начало подключения
      let state = profileOrdersSlice.reducer(initialState, wsProfileOrdersConnecting());
      expect(state.status).toBe(WebsocketStatus.CONNECTING);

      // Успешное открытие соединения
      state = profileOrdersSlice.reducer(state, wsProfileOrdersOpen());
      expect(state.status).toBe(WebsocketStatus.ONLINE);
      expect(state.connectionError).toBeNull();

      // Получение сообщения
      state = profileOrdersSlice.reducer(
        state,
        wsProfileOrdersMessage(mockOrdersResponse)
      );
      expect(state.receivedMessage).toBe(true);
      expect(state.orders).not.toEqual([]);

      // Ошибка соединения
      state = profileOrdersSlice.reducer(state, wsProfileOrdersError('Connection lost'));
      expect(state.connectionError).toBe('Connection lost');

      // Закрытие соединения
      state = profileOrdersSlice.reducer(state, wsProfileOrdersClose());
      expect(state.status).toBe(WebsocketStatus.OFFLINE);
      expect(state.receivedMessage).toBe(false);
      // orders должны сохраниться
      expect(state.orders).not.toEqual([]);
    });
  });
});
