import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/reducer';
import { currentIngredientSlice } from './current-ingredient/reducer';
import { feedOrdersSlice } from './feed-orders/reducer';
import { ingredientsSlice } from './ingredients/reducer';
import { feedOrdersMiddleware } from './middleware/feed-orders-middleware';
import { profileOrdersMiddleware } from './middleware/profile-orders-middleware';
import { orderSlice } from './order/reducer';
import { profileOrdersSlice } from './profile-orders/reducer';
import { userSlice } from './user/reducer';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  currentIngredientSlice,
  orderSlice,
  userSlice,
  feedOrdersSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedOrdersMiddleware, profileOrdersMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
