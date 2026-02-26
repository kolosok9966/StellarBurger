import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

import type { TOrdersResponse, TOrder, TOrderResponse } from '@/utils/types';

import type { RootState } from '../store';

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredientsIds) => {
    const res = await request<TOrderResponse>('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: ingredientsIds,
      }),
    });

    return res.order;
  }
);

export const fetchOrderIfNeeded = createAsyncThunk<TOrder, number, { state: RootState }>(
  'order/fetchIfNeeded',
  async (orderNumber, { getState }) => {
    const state = getState();

    if (state.order.order?.number === orderNumber) {
      return state.order.order;
    }

    const feedOrder = state.feedOrders.orders.find((o) => o.number === orderNumber);
    if (feedOrder) return feedOrder;

    const profileOrder = state.profileOrders.orders.find(
      (o) => o.number === orderNumber
    );
    if (profileOrder) return profileOrder;

    const res = await request<TOrdersResponse>(`/orders/${orderNumber}`);
    return res.orders[0];
  }
);
