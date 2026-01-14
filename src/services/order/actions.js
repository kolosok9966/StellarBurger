import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

export const createOrder = createAsyncThunk('order/create', async (ingredientsIds) => {
  const res = await request('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: ingredientsIds,
    }),
  });

  return res.order.number;
});
