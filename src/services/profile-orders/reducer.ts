import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TOrdersResponse, WebsocketStatus, type OrdersState } from '@utils/types';

const initialState: OrdersState = {
  status: WebsocketStatus.OFFLINE,
  orders: [],
  total: 0,
  totalToday: 0,
  connectionError: null,
  receivedMessage: false,
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
      state.receivedMessage = false;
      state.status = WebsocketStatus.OFFLINE;
    },
    wsProfileOrdersError(state, action: PayloadAction<string>) {
      state.connectionError = action.payload;
    },
    wsProfileOrdersMessage(state, action: PayloadAction<TOrdersResponse>) {
      state.receivedMessage = true;
      state.orders = [...action.payload.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.total = action.payload?.total ?? 0;
      state.totalToday = action.payload?.totalToday ?? 0;
    },
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileTotal: (state) => state.total,
    getProfileTotalToday: (state) => state.totalToday,
    getProfileStatus: (state) => state.status,
    getProfileConnectionError: (state) => state.connectionError,
    getProfileReceivedMessage: (state) => state.receivedMessage,
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
  getProfileConnectionError,
  getProfileReceivedMessage,
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
