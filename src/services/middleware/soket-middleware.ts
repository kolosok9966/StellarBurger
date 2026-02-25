import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type TWsMessage = Record<string, unknown>;

export type TWsActionTypes = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TWsMessage>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = (
  wsActions: TWsActionTypes
): Middleware<object, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer = 0;
    let isConnected = false;
    let url = '';

    const { connect, disconnect, onConnecting, onOpen, onClose, onError, onMessage } =
      wsActions;

    return (next) => (action) => {
      const { dispatch } = store;

      if (connect.match(action)) {
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

        socket.onmessage = (event): void => {
          try {
            const data = JSON.parse(event.data);
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
        isConnected = false;
        socket?.close();
        socket = null;
      }

      return next(action);
    };
  };
};
