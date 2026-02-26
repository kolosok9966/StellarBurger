import { createAction } from '@reduxjs/toolkit';

export const profileOrdersWsConnect = createAction<string>('PROFILE_ORDERS_WS_CONNECT');
export const profileOrdersWsDisconnect = createAction('PROFILE_ORDERS_WS_DISCONNECT');

export type TProfileOrdersWsExternalActions =
  | ReturnType<typeof profileOrdersWsConnect>
  | ReturnType<typeof profileOrdersWsDisconnect>;
