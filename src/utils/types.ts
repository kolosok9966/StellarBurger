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

export type TOrder = {
  ingredients: string[];
  _id: string;
  status: 'created' | 'pending' | 'done';
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type OrdersState = {
  status: WebsocketStatus;
  orders: TOrder[];
  total: number;
  totalToday: number;
  connectionError: string | null;
};

export const WebsocketStatus = {
  OFFLINE: 'OFFLINE',
  CONNECTING: 'CONNECTING',
  ONLINE: 'ONLINE',
} as const;

export type WebsocketStatus = (typeof WebsocketStatus)[keyof typeof WebsocketStatus];

export type DropIngredient = Ingredient & { index: number };

export type IngredientWithCount = Ingredient & { count: number };
