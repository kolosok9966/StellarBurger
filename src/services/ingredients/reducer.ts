import { createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

import type { Ingredient } from '@/utils/types';

type IngredientsState = {
  items: Ingredient[];
  loading: boolean;
  error: boolean;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: false,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    getIngredients: (state) => state.items,
    getIngredientsLoading: (state) => state.loading,
    getIngredientsError: (state) => state.error,
    getIngredientsBuns: createSelector(
      (state: IngredientsState) => state.items,
      (items: Ingredient[]) => items.filter((item) => item.type === 'bun')
    ),
    getIngredientsMains: createSelector(
      (state: IngredientsState) => state.items,
      (items: Ingredient[]) => items.filter((item) => item.type === 'main')
    ),
    getIngredientsSauces: createSelector(
      (state: IngredientsState) => state.items,
      (items: Ingredient[]) => items.filter((item) => item.type === 'sauce')
    ),
    getIngredientById: createSelector(
      [
        (state: IngredientsState): Ingredient[] => state.items,
        (_: IngredientsState, id: string): string => id,
      ],
      (items: Ingredient[], id: string): Ingredient | undefined =>
        items.find((item) => item._id === id)
    ),
  },
  reducers: {
    incrementCount(state, action: { payload: Ingredient }) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.items.forEach((i) => {
          if (i.type === 'bun') {
            i.count = i._id === ingredient._id ? 2 : 0;
          }
        });
      } else {
        const item = state.items.find((i) => i._id === ingredient._id);
        if (item && item.count !== undefined) item.count += 1;
      }
    },
    decrementCount(state, action: { payload: Ingredient }) {
      const ingredient = action.payload;
      const item = state.items.find((i) => i._id === ingredient._id);
      if (item && item.count !== undefined) item.count -= 1;
    },
    clearCounts(state) {
      state.items.forEach((item) => {
        item.count = 0;
      });
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

export const getIngredientsByIds = createSelector(
  [
    (state: IngredientsState): Ingredient[] => state.items,
    (_: IngredientsState, ids: string[]): string[] => ids,
  ],
  (items: Ingredient[], ids: string[]): { ingredients: Ingredient[]; total: number } => {
    const orderIngredients = ids
      .map((id) => items.find((item) => item._id === id))
      .filter((item): item is Ingredient => Boolean(item));

    const total = orderIngredients.reduce(
      (sum: number, item: Ingredient) => sum + item.price,
      0
    );

    return {
      ingredients: orderIngredients,
      total,
    };
  }
);

export const {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientsBuns,
  getIngredientsMains,
  getIngredientsSauces,
  getIngredientById,
} = ingredientsSlice.selectors;
export const { incrementCount, decrementCount, clearCounts } = ingredientsSlice.actions;
