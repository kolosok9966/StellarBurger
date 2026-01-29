import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/reducer';
import { currentIngredientSlice } from './current-ingredient/reducer';
import { ingredientsSlice } from './ingredients/reducer';
import { orderSlice } from './order/reducer';
import { userSlice } from './user/reducer';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  currentIngredientSlice,
  orderSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
