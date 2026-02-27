import { createAction } from '@reduxjs/toolkit';

export const feedOrdersWsConnect = createAction<string>('FEED_ORDERS_WS_CONNECT');
export const feedOrdersWsDisconnect = createAction('FEED_ORDERS_WS_DISCONNECT');

export type TFeedOrdersWsExternalActions =
  | ReturnType<typeof feedOrdersWsConnect>
  | ReturnType<typeof feedOrdersWsDisconnect>;
