import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { FC } from 'react';

import type { Order } from '@utils/types';

import styles from './order-card.module.css';

type Props = {
  order: Order;
  onClick: () => void;
};

export const OrderCard: FC<Props> = ({ order, onClick }) => {
  return (
    <div className={`${styles.card} mb-4 p-6`} onClick={onClick}>
      <div className={`${styles.cardHeader} mb-6`}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {order.date}
        </span>
      </div>

      <p className="text text_type_main-medium mb-6">{order.name}</p>

      <div className={styles.cardFooter}>
        <div className={styles.ingredients}>
          {order.ingredients.slice(0, 6).map((img, index) => (
            <div key={index} className={styles.ingredient} style={{ zIndex: 6 - index }}>
              <div className={styles.ingredientInner}>
                <img src={img} alt="ingredient" />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{order.total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
