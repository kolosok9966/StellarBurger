import {
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
} from '../profile-orders/action';
import {
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersClose,
  wsProfileOrdersError,
  wsProfileOrdersMessage,
} from '../profile-orders/reducer';
import { socketMiddleware } from './soket-middleware';

import type { TOrdersResponse } from '@/utils/types';

export const profileOrdersMiddleware = socketMiddleware<TOrdersResponse>(
  {
    connect: profileOrdersWsConnect,
    disconnect: profileOrdersWsDisconnect,
    onConnecting: wsProfileOrdersConnecting,
    onOpen: wsProfileOrdersOpen,
    onClose: wsProfileOrdersClose,
    onError: wsProfileOrdersError,
    onMessage: wsProfileOrdersMessage,
  },
  true
);
