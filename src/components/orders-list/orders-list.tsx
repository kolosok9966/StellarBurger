import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from './order-card/order-card';

import type { FC } from 'react';

import type { TOrder } from '@/utils/types';

import styles from './orders-list.module.css';

type OrderListProps = {
  orders: TOrder[];
  url: string;
  showStatus?: boolean;
};

export const OrdersList: FC<OrderListProps> = ({ orders, url, showStatus = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.orders}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          showStatus={showStatus}
          onClick={() =>
            navigate(`${url}/${order.number}`, { state: { background: location } })
          }
        />
      ))}
    </div>
  );
};
