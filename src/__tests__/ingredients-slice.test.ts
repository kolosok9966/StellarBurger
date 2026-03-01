import { describe, it, expect, beforeEach } from 'vitest';

import { fetchIngredients } from '@/services/ingredients/actions';
import {
  ingredientsSlice,
  incrementCount,
  decrementCount,
  clearCounts,
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientsBuns,
  getIngredientsMains,
  getIngredientsSauces,
  getIngredientById,
  getIngredientsByIds,
} from '@/services/ingredients/reducer';

import type { Ingredient } from '@/utils/types';

describe('ingredientsSlice', () => {
  let initialState: ReturnType<typeof ingredientsSlice.reducer>;

  const mockBun: Ingredient = {
    _id: '1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://...',
    image_mobile: 'https://...',
    image_large: 'https://...',
    __v: 0,
    count: 0,
  };

  const mockMain: Ingredient = {
    _id: '2',
    name: 'Мясо бессмертных моллюсков',
    type: 'main',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1337,
    image: 'https://...',
    image_mobile: 'https://...',
    image_large: 'https://...',
    __v: 0,
    count: 0,
  };

  const mockSauce: Ingredient = {
    _id: '3',
    name: 'Соус традиционный',
    type: 'sauce',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 500,
    image: 'https://...',
    image_mobile: 'https://...',
    image_large: 'https://...',
    __v: 0,
    count: 0,
  };

  const mockIngredients = [mockBun, mockMain, mockSauce];

  beforeEach(() => {
    initialState = {
      items: [],
      loading: false,
      error: false,
    };
  });

  it('should return initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('reducers', () => {
    describe('incrementCount', () => {
      it('should increment count for non-bun ingredient', () => {
        const stateWithItems = {
          ...initialState,
          items: mockIngredients.map((i) => ({ ...i, count: 0 })),
        };

        const action = incrementCount(mockMain);
        const newState = ingredientsSlice.reducer(stateWithItems, action);

        const updatedItem = newState.items.find((i) => i._id === mockMain._id);
        expect(updatedItem?.count).toBe(1);
      });

      it('should set bun count to 2 and reset other buns to 0', () => {
        const anotherBun: Ingredient = {
          ...mockBun,
          _id: '4',
          name: 'Флюоресцентная булка',
        };

        const stateWithBuns = {
          ...initialState,
          items: [
            { ...mockBun, count: 2 },
            { ...anotherBun, count: 0 },
            { ...mockMain, count: 3 },
          ],
        };

        const action = incrementCount(anotherBun);
        const newState = ingredientsSlice.reducer(stateWithBuns, action);

        const firstBun = newState.items.find((i) => i._id === mockBun._id);
        const secondBun = newState.items.find((i) => i._id === anotherBun._id);
        const mainItem = newState.items.find((i) => i._id === mockMain._id);

        expect(firstBun?.count).toBe(0);
        expect(secondBun?.count).toBe(2);
        expect(mainItem?.count).toBe(3); // Должен сохранить свое значение
      });

      it('should handle increment when count is undefined', () => {
        const itemWithoutCount = { ...mockMain, count: undefined };
        const stateWithItems = {
          ...initialState,
          items: [itemWithoutCount],
        };

        const action = incrementCount(mockMain);
        const newState = ingredientsSlice.reducer(stateWithItems, action);

        const updatedItem = newState.items.find((i) => i._id === mockMain._id);
        expect(updatedItem?.count).toBeUndefined();
      });
    });

    describe('decrementCount', () => {
      it('should decrement count for ingredient', () => {
        const stateWithItems = {
          ...initialState,
          items: [{ ...mockMain, count: 5 }],
        };

        const action = decrementCount(mockMain);
        const newState = ingredientsSlice.reducer(stateWithItems, action);

        const updatedItem = newState.items.find((i) => i._id === mockMain._id);
        expect(updatedItem?.count).toBe(4);
      });

      it('should handle decrement when count is undefined', () => {
        const itemWithoutCount = { ...mockMain, count: undefined };
        const stateWithItems = {
          ...initialState,
          items: [itemWithoutCount],
        };

        const action = decrementCount(mockMain);
        const newState = ingredientsSlice.reducer(stateWithItems, action);

        const updatedItem = newState.items.find((i) => i._id === mockMain._id);
        expect(updatedItem?.count).toBeUndefined();
      });

      it('should not decrement below 0', () => {
        const stateWithItems = {
          ...initialState,
          items: [{ ...mockMain, count: 0 }],
        };

        const action = decrementCount(mockMain);
        const newState = ingredientsSlice.reducer(stateWithItems, action);

        const updatedItem = newState.items.find((i) => i._id === mockMain._id);
        expect(updatedItem?.count).toBe(0);
      });
    });

    describe('clearCounts', () => {
      it('should reset all counts to 0', () => {
        const stateWithCounts = {
          ...initialState,
          items: [
            { ...mockBun, count: 2 },
            { ...mockMain, count: 5 },
            { ...mockSauce, count: 3 },
          ],
        };

        const action = clearCounts();
        const newState = ingredientsSlice.reducer(stateWithCounts, action);

        newState.items.forEach((item) => {
          expect(item.count).toBe(0);
        });
      });

      it('should handle empty items array', () => {
        const action = clearCounts();
        const newState = ingredientsSlice.reducer(initialState, action);

        expect(newState.items).toEqual([]);
      });
    });
  });

  describe('extraReducers', () => {
    describe('fetchIngredients.pending', () => {
      it('should set loading true and clear items/error', () => {
        const stateWithData = {
          items: mockIngredients,
          loading: false,
          error: false,
        };

        const action = { type: fetchIngredients.pending.type };
        const newState = ingredientsSlice.reducer(stateWithData, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBe(false);
        expect(newState.items).toEqual([]);
      });
    });

    describe('fetchIngredients.fulfilled', () => {
      it('should set items with count 0 and loading false', () => {
        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients,
        };
        const newState = ingredientsSlice.reducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(false);
        expect(newState.items).toHaveLength(3);
        expect(newState.items[0]).toEqual({ ...mockBun, count: 0 });
        expect(newState.items[1]).toEqual({ ...mockMain, count: 0 });
        expect(newState.items[2]).toEqual({ ...mockSauce, count: 0 });
      });
    });

    describe('fetchIngredients.rejected', () => {
      it('should set error true and loading false', () => {
        const stateWithLoading = {
          items: [],
          loading: true,
          error: false,
        };

        const action = { type: fetchIngredients.rejected.type };
        const newState = ingredientsSlice.reducer(stateWithLoading, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(true);
        expect(newState.items).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    let stateWithItems: { ingredients: typeof initialState };

    beforeEach(() => {
      stateWithItems = {
        ingredients: {
          items: mockIngredients,
          loading: false,
          error: false,
        },
      };
    });

    it('getIngredients should return all items', () => {
      expect(getIngredients(stateWithItems)).toEqual(mockIngredients);
    });

    it('getIngredientsLoading should return loading state', () => {
      expect(getIngredientsLoading(stateWithItems)).toBe(false);
    });

    it('getIngredientsError should return error state', () => {
      expect(getIngredientsError(stateWithItems)).toBe(false);
    });

    it('getIngredientsBuns should return only buns', () => {
      const result = getIngredientsBuns(stateWithItems);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('bun');
    });

    it('getIngredientsMains should return only mains', () => {
      const result = getIngredientsMains(stateWithItems);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('main');
    });

    it('getIngredientsSauces should return only sauces', () => {
      const result = getIngredientsSauces(stateWithItems);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('sauce');
    });

    describe('getIngredientById', () => {
      it('should return ingredient by id', () => {
        const result = getIngredientById(stateWithItems, mockMain._id);
        expect(result).toEqual(mockMain);
      });

      it('should return undefined for non-existent id', () => {
        const result = getIngredientById(stateWithItems, 'non-existent');
        expect(result).toBeUndefined();
      });
    });

    describe('getIngredientsByIds', () => {
      it('should return ingredients and total price by ids', () => {
        const ids = [mockBun._id, mockMain._id, mockSauce._id];
        const result = getIngredientsByIds(stateWithItems, ids);

        expect(result.ingredients).toHaveLength(3);
        expect(result.ingredients[0]).toEqual(mockBun);
        expect(result.ingredients[1]).toEqual(mockMain);
        expect(result.ingredients[2]).toEqual(mockSauce);
        expect(result.total).toBe(mockBun.price + mockMain.price + mockSauce.price);
      });

      it('should handle duplicate ids', () => {
        const ids = [mockBun._id, mockBun._id, mockMain._id];
        const result = getIngredientsByIds(stateWithItems, ids);

        expect(result.ingredients).toHaveLength(3);
        expect(result.ingredients[0]).toEqual(mockBun);
        expect(result.ingredients[1]).toEqual(mockBun);
        expect(result.ingredients[2]).toEqual(mockMain);
      });

      it('should filter out non-existent ids', () => {
        const ids = [mockBun._id, 'non-existent', mockMain._id];
        const result = getIngredientsByIds(stateWithItems, ids);

        expect(result.ingredients).toHaveLength(2);
        expect(result.ingredients[0]).toEqual(mockBun);
        expect(result.ingredients[1]).toEqual(mockMain);
        expect(result.total).toBe(mockBun.price + mockMain.price);
      });

      it('should return empty array and total 0 for empty ids', () => {
        const result = getIngredientsByIds(stateWithItems, []);
        expect(result.ingredients).toEqual([]);
        expect(result.total).toBe(0);
      });
    });
  });
});
