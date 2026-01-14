import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

export const fetchIngredients = createAsyncThunk('ingredients/fetch', async () => {
  const res = await request('/ingredients');
  return res.data;
});
