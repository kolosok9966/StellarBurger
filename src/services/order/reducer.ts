import { createSlice } from '@reduxjs/toolkit';

import { createOrder, fetchOrderIfNeeded } from './actions';

import type { TOrder } from '@/utils/types';

type orderState = {
  order: TOrder | null;
  loading: boolean;
  error: boolean;
};

const initialState: orderState = {
  order: null,
  loading: false,
  error: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    getOrderNumber: (state) => state.order?.number,
    getOrder: (state) => state.order,
    getOrderLoading: (state) => state.loading,
    getOrderError: (state) => state.error,
  },
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.order = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchOrderIfNeeded.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.order = null;
      })
      .addCase(fetchOrderIfNeeded.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderIfNeeded.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { getOrderNumber, getOrderLoading, getOrderError, getOrder } =
  orderSlice.selectors;
export const { clearOrder } = orderSlice.actions;
