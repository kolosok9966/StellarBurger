import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@/hooks/usea-app-selector';
import { getIngredientsByIds } from '@/services/ingredients/reducer';

import type { FC } from 'react';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type Props = {
  order: TOrder;
  onClick: () => void;
};

export const OrderCard: FC<Props> = ({ order, onClick }) => {
  const { ingredients, total } = useAppSelector((state) =>
    getIngredientsByIds(state.ingredients, order.ingredients)
  );

  return (
    <div className={`${styles.card} mb-4 p-6`} onClick={onClick}>
      <div className={`${styles.cardHeader} mb-6`}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
      </div>

      <p className="text text_type_main-medium mb-6">{order.name}</p>

      <div className={styles.cardFooter}>
        <div className={styles.ingredients}>
          {ingredients.slice(0, 6).map((ingredient, index) => (
            <div key={index} className={styles.ingredient} style={{ zIndex: 6 - index }}>
              <div className={styles.ingredientInner}>
                <img src={ingredient?.image} alt="ingredient" />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
