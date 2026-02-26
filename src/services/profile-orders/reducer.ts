import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TOrdersResponse, WebsocketStatus, type OrdersState } from '@utils/types';

const initialState: OrdersState = {
  status: WebsocketStatus.OFFLINE,
  orders: [],
  total: 0,
  totalToday: 0,
  connectionError: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsProfileOrdersConnecting(state) {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsProfileOrdersOpen(state) {
      state.status = WebsocketStatus.ONLINE;
      state.connectionError = null;
    },
    wsProfileOrdersClose(state) {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsProfileOrdersError(state, action: PayloadAction<string>) {
      state.connectionError = action.payload;
    },
    wsProfileOrdersMessage(state, action: PayloadAction<TOrdersResponse>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileTotal: (state) => state.total,
    getProfileTotalToday: (state) => state.totalToday,
    getProfileStatus: (state) => state.status,
  },
});

export const {
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersClose,
  wsProfileOrdersError,
  wsProfileOrdersMessage,
} = profileOrdersSlice.actions;

export const {
  getProfileOrders,
  getProfileTotal,
  getProfileTotalToday,
  getProfileStatus,
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
