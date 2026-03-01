import { describe, it, expect, beforeEach } from 'vitest';

import {
  burgerConstructorSlice,
  addSelectedIngredient,
  removeSelectedIngredient,
  clearBurgerConstructor,
  reorderIngredients,
  getSelectedBun,
  getSelectedIngredients,
} from '@/services/burger-constructor/reducer';

import type { Ingredient } from '@/utils/types';

describe('burgerConstructorSlice', () => {
  let initialState: ReturnType<typeof burgerConstructorSlice.reducer>;

  const mockBun: Ingredient = {
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

  const mockIngredientSauce: Ingredient = {
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

  const mockIngredientMain: Ingredient = {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
    __v: 0,
  };

  // Перед каждым тестом сбрасываем состояние до начального
  beforeEach(() => {
    initialState = {
      selectedBun: null,
      selectedIngredients: [],
    };
  });

  it('should return initial state', () => {
    expect(burgerConstructorSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('selectors', () => {
    it('getSelectedBun should return selected bun', () => {
      const rootState = { burgerConstructor: { ...initialState, selectedBun: mockBun } };
      expect(getSelectedBun(rootState)).toBe(mockBun);
    });

    it('getSelectedIngredients should return selected ingredients', () => {
      const ingredientWithUid1 = { ...mockIngredientSauce, uid: 'test-uid-1' };
      const ingredientWithUid2 = { ...mockIngredientMain, uid: 'test-uid-2' };
      const rootState = {
        burgerConstructor: {
          ...initialState,
          selectedIngredients: [ingredientWithUid1, ingredientWithUid2],
        },
      };
      expect(getSelectedIngredients(rootState)).toEqual([
        ingredientWithUid1,
        ingredientWithUid2,
      ]);
    });
  });

  describe('addSelectedIngredient', () => {
    it('should add bun to selectedBun when ingredient type is bun', () => {
      const action = addSelectedIngredient(mockBun);
      const newState = burgerConstructorSlice.reducer(initialState, action);

      expect(newState.selectedBun).toEqual(mockBun);
      expect(newState.selectedIngredients).toEqual([]);
    });

    // Граничный случай
    it('should replace existing bun with new bun', () => {
      const stateWithBun = { ...initialState, selectedBun: mockBun };
      const newBun: Ingredient = { ...mockBun, _id: '4', name: 'Флюоресцентная булка' };

      const action = addSelectedIngredient(newBun);
      const newState = burgerConstructorSlice.reducer(stateWithBun, action);

      expect(newState.selectedBun).toEqual(newBun);
      expect(newState.selectedIngredients).toEqual([]);
    });

    it('should add ingredient to selectedIngredients with uid when type is not bun', () => {
      const action = addSelectedIngredient(mockIngredientMain);
      const newState = burgerConstructorSlice.reducer(initialState, action);

      expect(newState.selectedBun).toBeNull();
      expect(newState.selectedIngredients).toHaveLength(1);
      expect(newState.selectedIngredients[0]).toMatchObject({
        ...mockIngredientMain,
        uid: expect.any(String),
      });
    });

    it('should add multiple ingredients to selectedIngredients', () => {
      const state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockIngredientSauce)
      );
      const finalState = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientMain)
      );

      expect(finalState.selectedIngredients).toHaveLength(2);
      expect(finalState.selectedIngredients[0]).toMatchObject({
        ...mockIngredientSauce,
        uid: expect.any(String),
      });
      expect(finalState.selectedIngredients[1]).toMatchObject({
        ...mockIngredientMain,
        uid: expect.any(String),
      });
    });
  });

  describe('removeSelectedIngredient', () => {
    it('should remove ingredient from selectedIngredients by uid', () => {
      const addAction = addSelectedIngredient(mockIngredientMain);
      const stateWithIngredient = burgerConstructorSlice.reducer(
        initialState,
        addAction
      );
      const ingredientToRemove = stateWithIngredient.selectedIngredients[0];

      const removeAction = removeSelectedIngredient(ingredientToRemove);
      const newState = burgerConstructorSlice.reducer(stateWithIngredient, removeAction);

      expect(newState.selectedIngredients).toHaveLength(0);
    });

    // Граничный случай
    it('should not remove ingredient if uid does not match', () => {
      const addAction = addSelectedIngredient(mockIngredientMain);
      const stateWithIngredient = burgerConstructorSlice.reducer(
        initialState,
        addAction
      );

      const removeAction = removeSelectedIngredient({ uid: 'non-existent-uid' });
      const newState = burgerConstructorSlice.reducer(stateWithIngredient, removeAction);

      expect(newState.selectedIngredients).toHaveLength(1);
    });

    it('should remove correct ingredient when multiple ingredients exist', () => {
      let state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockIngredientMain)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientSauce)
      );

      const ingredientToRemove = state.selectedIngredients[0];
      const removeAction = removeSelectedIngredient(ingredientToRemove);
      const newState = burgerConstructorSlice.reducer(state, removeAction);

      expect(newState.selectedIngredients).toHaveLength(1);
      expect(newState.selectedIngredients[0]).toMatchObject({
        ...mockIngredientSauce,
        uid: expect.any(String),
      });
    });
  });

  describe('reorderIngredients', () => {
    it('should reorder ingredients correctly', () => {
      let state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockIngredientMain)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientSauce)
      );

      const originalOrder = [...state.selectedIngredients];

      const reorderAction = reorderIngredients({ fromIndex: 0, toIndex: 1 });
      const newState = burgerConstructorSlice.reducer(state, reorderAction);

      expect(newState.selectedIngredients[0]).toBe(originalOrder[1]);
      expect(newState.selectedIngredients[1]).toBe(originalOrder[0]);
    });

    // Граничный случай
    it('should handle reorder with same index', () => {
      let state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockIngredientMain)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientSauce)
      );

      const originalState = { ...state };

      const reorderAction = reorderIngredients({ fromIndex: 0, toIndex: 0 });
      const newState = burgerConstructorSlice.reducer(state, reorderAction);

      expect(newState.selectedIngredients).toEqual(originalState.selectedIngredients);
    });

    // Граничный случай
    it('should handle reorder with out of bounds indices gracefully', () => {
      const state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockIngredientMain)
      );

      const reorderAction = reorderIngredients({ fromIndex: 0, toIndex: 5 });
      const newState = burgerConstructorSlice.reducer(state, reorderAction);

      expect(newState.selectedIngredients).toHaveLength(1);
    });
  });

  describe('clearBurgerConstructor', () => {
    it('should clear both bun and ingredients', () => {
      let state = burgerConstructorSlice.reducer(
        initialState,
        addSelectedIngredient(mockBun)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientMain)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addSelectedIngredient(mockIngredientSauce)
      );

      expect(state.selectedBun).toBeTruthy();
      expect(state.selectedIngredients).toHaveLength(2);

      const clearAction = clearBurgerConstructor();
      const newState = burgerConstructorSlice.reducer(state, clearAction);

      expect(newState.selectedBun).toBeNull();
      expect(newState.selectedIngredients).toHaveLength(0);
    });

    // Граничный случай
    it('should do nothing when state is already empty', () => {
      const clearAction = clearBurgerConstructor();
      const newState = burgerConstructorSlice.reducer(initialState, clearAction);

      expect(newState).toEqual(initialState);
    });
  });
});
