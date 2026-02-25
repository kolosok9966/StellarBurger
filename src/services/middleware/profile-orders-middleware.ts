import { ordersWsConnect, ordersWsDisconnect } from '../feed-orders/action';
import {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
} from '../feed-orders/reducer';
import { socketMiddleware } from './soket-middleware';

export const profileOrdersMiddleware = socketMiddleware({
  connect: ordersWsConnect,
  disconnect: ordersWsDisconnect,
  onConnecting: wsConnecting,
  onOpen: wsOpen,
  onClose: wsClose,
  onError: wsError,
  onMessage: wsMessage,
});
