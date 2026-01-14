import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/reducer';
import { currentIngredientSlice } from './current-ingredient/reducer';
import { ingredientsSlice } from './ingredients/reducer';
import { orderSlice } from './order/reducer';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  currentIngredientSlice,
  orderSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
