import { feedOrdersWsConnect, feedOrdersWsDisconnect } from '../feed-orders/action';
import {
  wsFeedOrdersConnecting,
  wsFeedOrdersOpen,
  wsFeedOrdersClose,
  wsFeedOrdersError,
  wsFeedOrdersMessage,
} from '../feed-orders/reducer';
import { socketMiddleware } from './soket-middleware';

import type { TOrdersResponse } from '@/utils/types';

export const feedOrdersMiddleware = socketMiddleware<TOrdersResponse>({
  connect: feedOrdersWsConnect,
  disconnect: feedOrdersWsDisconnect,
  onConnecting: wsFeedOrdersConnecting,
  onOpen: wsFeedOrdersOpen,
  onClose: wsFeedOrdersClose,
  onError: wsFeedOrdersError,
  onMessage: wsFeedOrdersMessage,
});
