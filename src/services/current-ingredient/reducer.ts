import { createSlice } from '@reduxjs/toolkit';

import type { Ingredient } from '@/utils/types';

type CurrentIngredientState = Ingredient | null;

const initialState: CurrentIngredientState = null;

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  selectors: {
    getCurrentIngredient: (state) => state,
  },
  reducers: {
    setCurrentIngredient: (_, action) => action.payload,
    clearCurrentIngredient: () => null,
  },
});

export const { getCurrentIngredient } = currentIngredientSlice.selectors;
export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;
