import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '@/utils/types';

type IngredientWithUID = Ingredient & { uid: string };

type BurgerConstructorState = {
  selectedBun: Ingredient | null;
  selectedIngredients: IngredientWithUID[];
};
const initialState: BurgerConstructorState = {
  selectedBun: null,
  selectedIngredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    getSelectedBun: (state) => state.selectedBun,
    getSelectedIngredients: (state) => state.selectedIngredients,
  },
  reducers: {
    addSelectedIngredient: {
      reducer(state, action: PayloadAction<Ingredient | IngredientWithUID>) {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.selectedBun = ingredient as Ingredient;
        } else {
          state.selectedIngredients.push(ingredient as IngredientWithUID);
        }
      },
      prepare(ingredient: Ingredient) {
        if (ingredient.type === 'bun') {
          return { payload: ingredient };
        }
        return { payload: { ...ingredient, uid: crypto.randomUUID() } };
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
