import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import { getIngredientsByIds } from '@/services/ingredients/reducer';
import { fetchOrderIfNeeded } from '@/services/order/actions'; // <-- правильный thunk
import { getOrder, getOrderLoading } from '@/services/order/reducer';
import { getStatusConfig } from '@/utils/order-helper';

import type { FC } from 'react';

import type { IngredientWithCount } from '@utils/types';

import styles from './order.module.css';

export const Order: FC = () => {
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>();

  const order = useAppSelector(getOrder);
  const loading = useAppSelector(getOrderLoading);
  useEffect(() => {
    if (number) {
      dispatch(fetchOrderIfNeeded(Number(number)));
    }
  }, [number, dispatch]);

  const { ingredients, total } = useAppSelector((state) =>
    getIngredientsByIds(state.ingredients, order?.ingredients || [])
  );

  const groupedIngredients = useMemo(() => {
    if (!ingredients.length) return [];

    const map = ingredients.reduce<Record<string, IngredientWithCount>>((acc, item) => {
      if (!acc[item._id]) {
        acc[item._id] = { ...item, count: 1 };
      } else {
        acc[item._id].count += 1;
      }
      return acc;
    }, {});

    return Object.values(map);
  }, [ingredients]);

  if (loading) {
    return <div className={styles.wrapper}>Загрузка...</div>;
  }

  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className={`${styles.wrapper} pt-10`}>
      <p className="text text_type_digits-default mb-10">#{order.number}</p>

      <h2 className="text text_type_main-medium mb-3">{order.name}</h2>

      <p
        className="text text_type_main-default mb-15"
        style={{ color: statusConfig.color }}
      >
        {statusConfig.text}
      </p>

      <p className="text text_type_main-medium mb-6">Состав:</p>

      <div className={`${styles.ingredients} custom-scroll`}>
        {groupedIngredients.map((item) => (
          <div key={item._id} className={`${styles.ingredient} mb-4`}>
            <div className={styles.ingredientInfo}>
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} />
              </div>
              <span className="text text_type_main-default ml-4">{item.name}</span>
            </div>

            <div className={styles.price}>
              <span className="text text_type_digits-default mr-2">
                {item.count} x {item.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.footer} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>

        <div className={styles.total}>
          <span className="text text_type_digits-default mr-2">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
