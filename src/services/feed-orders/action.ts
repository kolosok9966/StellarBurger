import { createAction } from '@reduxjs/toolkit';

export const ordersWsConnect = createAction<string>('ORDERS_WS_CONNECT');
export const ordersWsDisconnect = createAction('ORDERS_WS_DISCONNECT');

export type TOrdersWsExternalActions =
  | ReturnType<typeof ordersWsConnect>
  | ReturnType<typeof ordersWsDisconnect>;
