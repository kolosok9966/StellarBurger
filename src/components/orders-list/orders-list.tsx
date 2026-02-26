import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from './order-card/order-card';

import type { FC } from 'react';

import type { TOrder } from '@/utils/types';

import styles from './orders-list.module.css';

type OrderListProps = {
  orders: TOrder[];
  url: string;
};

export const OrdersList: FC<OrderListProps> = ({ orders, url }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.orders}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onClick={() =>
            navigate(`${url}/${order._id}`, { state: { background: location } })
          }
        />
      ))}
    </div>
  );
};
