import { createSlice } from '@reduxjs/toolkit';

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState: null,
  selectors: {
    getCurrentIngredient: (state) => state,
  },
  reducers: {
    setCurrentIngredient: (state, action) => action.payload,
    clearCurrentIngredient: () => null,
  },
});

export const { getCurrentIngredient } = currentIngredientSlice.selectors;
export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;
