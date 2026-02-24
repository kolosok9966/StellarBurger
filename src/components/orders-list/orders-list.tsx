import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from './order-card/order-card';

import type { FC } from 'react';

import type { Order } from '@utils/types';

import styles from './orders-list.module.css';

const orders: Order[] = [
  {
    _id: '1',
    number: 34535,
    name: 'Death Star Starship Main бургер',
    date: 'Сегодня, 16:20 i-GMT+3',
    status: 'done',
    ingredients: [
      'https://code.s3.yandex.net/react/code/bun-02.png',
      'https://code.s3.yandex.net/react/code/sauce-03.png',
      'https://code.s3.yandex.net/react/code/meat-02.png',
      'https://code.s3.yandex.net/react/code/cheese.png',
    ],
    total: 480,
  },
  {
    _id: '2',
    number: 34534,
    name: 'Interstellar бургер',
    date: 'Сегодня, 13:20 i-GMT+3',
    status: 'canceled',
    ingredients: [
      'https://code.s3.yandex.net/react/code/bun-01.png',
      'https://code.s3.yandex.net/react/code/sauce-02.png',
      'https://code.s3.yandex.net/react/code/meat-01.png',
      'https://code.s3.yandex.net/react/code/cheese.png',
      'https://code.s3.yandex.net/react/code/sauce-01.png',
    ],
    total: 560,
  },
  {
    _id: '3',
    number: 34534,
    name: 'Interstellar бургер',
    date: 'Сегодня, 13:20 i-GMT+3',
    status: 'pending',
    ingredients: [
      'https://code.s3.yandex.net/react/code/bun-01.png',
      'https://code.s3.yandex.net/react/code/sauce-02.png',
      'https://code.s3.yandex.net/react/code/meat-01.png',
      'https://code.s3.yandex.net/react/code/cheese.png',
      'https://code.s3.yandex.net/react/code/sauce-01.png',
    ],
    total: 560,
  },
  {
    _id: '4',
    number: 34534,
    name: 'Interstellar бургер',
    date: 'Сегодня, 13:20 i-GMT+3',
    status: 'pending',
    ingredients: [
      'https://code.s3.yandex.net/react/code/bun-01.png',
      'https://code.s3.yandex.net/react/code/sauce-02.png',
      'https://code.s3.yandex.net/react/code/meat-01.png',
      'https://code.s3.yandex.net/react/code/cheese.png',
      'https://code.s3.yandex.net/react/code/sauce-01.png',
    ],
    total: 560,
  },
  {
    _id: '5',
    number: 34534,
    name: 'Interstellar бургер',
    date: 'Сегодня, 13:20 i-GMT+3',
    status: 'pending',
    ingredients: [
      'https://code.s3.yandex.net/react/code/bun-01.png',
      'https://code.s3.yandex.net/react/code/sauce-02.png',
      'https://code.s3.yandex.net/react/code/meat-01.png',
      'https://code.s3.yandex.net/react/code/cheese.png',
      'https://code.s3.yandex.net/react/code/sauce-01.png',
    ],
    total: 560,
  },
];

export const OrdersList: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.orders}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onClick={() =>
            navigate(`/feed/${order._id}`, { state: { background: location } })
          }
        />
      ))}
    </div>
  );
};
