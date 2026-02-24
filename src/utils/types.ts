export type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  count?: number;
};
export type User = {
  email: string;
  name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type UpdateUserPayload = {
  email?: string;
  name?: string;
  password?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  token: string;
};

export type Order = {
  _id: string;
  number: number;
  name: string;
  date: string;
  status: OrderStatus;
  ingredients: string[];
  total: number;
};

export type OrderDetails = {
  _id: string;
  number: number;
  status: 'done' | 'pending' | 'created';
  createdAt: string;
  ingredients: string[];
};

export type OrderStatus = 'done' | 'pending' | 'canceled';

export type DropIngredient = Ingredient & { index: number };

export type IngredientWithCount = Ingredient & { count: number };
