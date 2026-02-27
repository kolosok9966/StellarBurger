import { getCookie, refreshToken } from '@/utils/request';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type TWsActionTypes<MessageType = unknown> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<MessageType>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <MessageType = unknown>(
  wsActions: TWsActionTypes<MessageType>,
  withTokenRefresh = false
): Middleware<object, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer = 0;
    let isConnected = false;
    let url = '';
    let isRefreshing = false;
    const { connect, disconnect, onConnecting, onOpen, onClose, onError, onMessage } =
      wsActions;

    return (next) => (action) => {
      const { dispatch } = store;

      if (connect.match(action)) {
        if (socket) {
          socket.close();
        }
        url = action.payload;
        socket = new WebSocket(url);
        isConnected = true;

        dispatch(onConnecting());

        socket.onopen = (): void => {
          dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('WebSocket error'));
        };

        socket.onmessage = async (event): Promise<void> => {
          try {
            const data = JSON.parse(event.data);

            if (withTokenRefresh && data?.message === 'Invalid or missing token') {
              if (isRefreshing) return;
              isRefreshing = true;

              dispatch(onError('Token expired. Refreshing...'));

              try {
                isConnected = false;
                socket?.close();

                await refreshToken();

                const newAccessToken = getCookie('accessToken');
                if (!newAccessToken) {
                  throw new Error('Failed to refresh token');
                }

                const wsUrl = new URL(url);
                wsUrl.searchParams.set('token', newAccessToken);

                isRefreshing = false;
                isConnected = true;

                dispatch(connect(wsUrl.toString()));
              } catch (error) {
                isRefreshing = false;
                dispatch(onError((error as Error).message));
                dispatch(disconnect());
              }

              return;
            }

            dispatch(onMessage(data));
          } catch (error) {
            dispatch(onError((error as Error).message));
          }
        };

        socket.onclose = (): void => {
          dispatch(onClose());

          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_PERIOD);
          }
        };
      }

      if (disconnect.match(action)) {
        clearTimeout(reconnectTimer);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
        socket = null;
        isConnected = false;
      }

      return next(action);
    };
  };
};
