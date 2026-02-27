// utils/order-helpers.ts
import type { TOrder } from './types';

export const STATUS_MAP = {
  created: {
    text: 'Создан',
    color: '#7722bf',
  },
  pending: {
    text: 'Готовится',
    color: '#4ca8aa',
  },
  done: {
    text: 'Выполнен',
    color: '#ffffff',
  },
  cancelled: {
    text: 'Отменен',
    color: '#ff0000',
  },
} as const;

export const getStatusConfig = (
  status: TOrder['status']
): (typeof STATUS_MAP)[keyof typeof STATUS_MAP] => STATUS_MAP[status];
