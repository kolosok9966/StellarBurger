import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './actions';

type orderState = {
  number: string | null;
  loading: boolean;
  error: boolean;
};

const initialState: orderState = {
  number: null,
  loading: false,
  error: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    getOrderNumber: (state) => state.number,
    getOrderLoading: (state) => state.loading,
    getOrderError: (state) => state.error,
  },
  reducers: {
    clearOrder(state) {
      state.number = null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.number = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.number = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { getOrderNumber, getOrderLoading, getOrderError } = orderSlice.selectors;
export const { clearOrder } = orderSlice.actions;
