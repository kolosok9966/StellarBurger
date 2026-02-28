import { describe, it, expect, beforeEach } from 'vitest';

import {
  currentIngredientSlice,
  setCurrentIngredient,
  clearCurrentIngredient,
  getCurrentIngredient,
} from '@/services/current-ingredient/reducer';

import type { Ingredient } from '@/utils/types';

describe('currentIngredientSlice', () => {
  let initialState: ReturnType<typeof currentIngredientSlice.reducer>;

  const mockIngredient: Ingredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  };

  const mockIngredient2: Ingredient = {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    __v: 0,
  };

  beforeEach(() => {
    initialState = null;
  });

  it('should return initial state', () => {
    expect(currentIngredientSlice.reducer(undefined, { type: '' })).toBeNull();
  });

  describe('selectors', () => {
    it('getCurrentIngredient should return current ingredient', () => {
      const stateWithIngredient = currentIngredientSlice.reducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );
      const state = { currentIngredient: stateWithIngredient };
      expect(getCurrentIngredient(state)).toEqual(mockIngredient);
    });

    // Граничный случай
    it('getCurrentIngredient should return null when no ingredient selected', () => {
      const state = { currentIngredient: null };
      expect(getCurrentIngredient(state)).toBeNull();
    });
  });

  describe('setCurrentIngredient', () => {
    it('should set current ingredient', () => {
      const action = setCurrentIngredient(mockIngredient);
      const newState = currentIngredientSlice.reducer(initialState, action);

      expect(newState).toEqual(mockIngredient);
    });

    // Граничный случай
    it('should replace existing ingredient with new one', () => {
      const stateWithIngredient = currentIngredientSlice.reducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );

      const action = setCurrentIngredient(mockIngredient2);
      const newState = currentIngredientSlice.reducer(stateWithIngredient, action);

      expect(newState).toEqual(mockIngredient2);
    });

    // Граничный случай
    it('should handle setting the same ingredient again', () => {
      const action = setCurrentIngredient(mockIngredient);
      const state = currentIngredientSlice.reducer(initialState, action);
      const newState = currentIngredientSlice.reducer(state, action);

      expect(newState).toEqual(mockIngredient);
    });
  });

  describe('clearCurrentIngredient', () => {
    it('should clear current ingredient when one is set', () => {
      const stateWithIngredient = currentIngredientSlice.reducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );

      expect(stateWithIngredient).toEqual(mockIngredient);

      const clearAction = clearCurrentIngredient();
      const newState = currentIngredientSlice.reducer(stateWithIngredient, clearAction);

      expect(newState).toBeNull();
    });

    // Граничный случай
    it('should do nothing when state is already null', () => {
      const clearAction = clearCurrentIngredient();
      const newState = currentIngredientSlice.reducer(initialState, clearAction);

      expect(newState).toBeNull();
    });

    it('should work after multiple set/clear operations', () => {
      let state = currentIngredientSlice.reducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );
      expect(state).toEqual(mockIngredient);

      state = currentIngredientSlice.reducer(state, clearCurrentIngredient());
      expect(state).toBeNull();

      state = currentIngredientSlice.reducer(
        state,
        setCurrentIngredient(mockIngredient2)
      );
      expect(state).toEqual(mockIngredient2);

      state = currentIngredientSlice.reducer(state, clearCurrentIngredient());
      expect(state).toBeNull();
    });
  });
});
