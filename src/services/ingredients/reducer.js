import { createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [],
    loading: false,
    error: false,
  },
  selectors: {
    getIngredients: (state) => state.items,
    getIngredientsLoading: (state) => state.loading,
    getIngredientsError: (state) => state.error,
    getIngredientsBuns: createSelector(
      (state) => state.items,
      (items) => items.filter((item) => item.type === 'bun')
    ),
    getIngredientsMains: createSelector(
      (state) => state.items,
      (items) => items.filter((item) => item.type === 'main')
    ),
    getIngredientsSauces: createSelector(
      (state) => state.items,
      (items) => items.filter((item) => item.type === 'sauce')
    ),
  },
  reducers: {
    incrementCount(state, action) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.items.forEach((i) => {
          if (i.type === 'bun') {
            i.count = i._id === ingredient._id ? 2 : 0;
          }
        });
      } else {
        const item = state.items.find((i) => i._id === ingredient._id);
        if (item) item.count = item.count + 1;
      }
    },
    decrementCount(state, action) {
      const ingredient = action.payload;
      const item = state.items.find((i) => i._id === ingredient._id);
      if (item) item.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.items = [];
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload.map((item) => ({ ...item, count: 0 }));
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientsBuns,
  getIngredientsMains,
  getIngredientsSauces,
} = ingredientsSlice.selectors;
export const { incrementCount, decrementCount } = ingredientsSlice.actions;
