// services/orders-slice.ts
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type TOrdersResponse, WebsocketStatus, type OrdersState } from '@utils/types';

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
    wsFeedOrdersConnecting(state) {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsFeedOrdersOpen(state) {
      state.status = WebsocketStatus.ONLINE;
      state.connectionError = null;
    },
    wsFeedOrdersClose(state) {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsFeedOrdersError(state, action: PayloadAction<string>) {
      state.connectionError = action.payload;
    },
    wsFeedOrdersMessage(state, action: PayloadAction<TOrdersResponse>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedLastDoneOrders: createSelector(
      (state: OrdersState) => state.orders,
      (orders) =>
        orders
          .filter((order) => order.status === 'done')
          .slice(0, 10)
          .map((order) => order.number)
    ),
    getFeedLastPendingOrders: createSelector(
      (state: OrdersState) => state.orders,
      (orders) =>
        orders
          .filter((order) => order.status === 'pending')
          .slice(0, 20)
          .map((order) => order.number)
    ),
    getFeedTotal: (state) => state.total,
    getFeedTotalToday: (state) => state.totalToday,
    getFeedStatus: (state) => state.status,
  },
});

export const {
  wsFeedOrdersConnecting,
  wsFeedOrdersOpen,
  wsFeedOrdersClose,
  wsFeedOrdersError,
  wsFeedOrdersMessage,
} = feedOrdersSlice.actions;

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedStatus,
  getFeedLastDoneOrders,
  getFeedLastPendingOrders,
} = feedOrdersSlice.selectors;

export default feedOrdersSlice.reducer;
