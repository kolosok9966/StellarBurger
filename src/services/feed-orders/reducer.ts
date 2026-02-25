// services/orders-slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TOrdersResponse, WebsocketStatus } from '@utils/types';

type OrdersState = {
  status: WebsocketStatus;
  orders: TOrdersResponse['orders'];
  total: number;
  totalToday: number;
  connectionError: string | null;
};

const initialState: OrdersState = {
  status: WebsocketStatus.OFFLINE,
  orders: [],
  total: 0,
  totalToday: 0,
  connectionError: null,
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {
    wsConnecting(state) {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsOpen(state) {
      state.status = WebsocketStatus.ONLINE;
      state.connectionError = null;
    },
    wsClose(state) {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsError(state, action: PayloadAction<string>) {
      state.connectionError = action.payload;
    },
    wsMessage(state, action: PayloadAction<TOrdersResponse>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  selectors: {
    getOrders: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getStatus: (state) => state.status,
  },
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } =
  feedOrdersSlice.actions;

export const { getOrders, getTotal, getTotalToday, getStatus } =
  feedOrdersSlice.selectors;

export default feedOrdersSlice.reducer;
