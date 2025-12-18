// services/store/slices/constructorSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    selectedBun: null,
    selectedIngredients: [],
  },
  selectors: {
    getSelectedBun: (state) => state.selectedBun,
    getSelectedIngredients: (state) => state.selectedIngredients,
  },
  reducers: {
    addSelectedIngredient: {
      reducer(state, action) {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.selectedBun = ingredient;
        } else {
          state.selectedIngredients.push(ingredient);
        }
      },
      prepare(ingredient) {
        return {
          payload: {
            ...ingredient,
            uid: crypto.randomUUID(),
          },
        };
      },
    },
    removeSelectedIngredient(state, action) {
      const ingredient = action.payload;
      state.selectedIngredients = state.selectedIngredients.filter(
        (i) => i.uid !== ingredient.uid
      );
    },
    reorderIngredients(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.selectedIngredients.splice(fromIndex, 1);
      state.selectedIngredients.splice(toIndex, 0, movedIngredient);
    },
    clearBurgerConstructor(state) {
      state.selectedBun = null;
      state.selectedIngredients = [];
    },
  },
});

export const { getSelectedBun, getSelectedIngredients } =
  burgerConstructorSlice.selectors;
export const {
  addSelectedIngredient,
  removeSelectedIngredient,
  clearBurgerConstructor,
  reorderIngredients,
} = burgerConstructorSlice.actions;
