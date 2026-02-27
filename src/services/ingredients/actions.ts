import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@/utils/request';

import type { IngredientsResponse, Ingredient } from '@/utils/types';

export const fetchIngredients = createAsyncThunk<Ingredient[]>(
  'ingredients/fetch',
  async () => {
    const res = await request<IngredientsResponse>('/ingredients');
    return res.data;
  }
);
