import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@/hooks/usea-app-selector';
import { getIngredients } from '@/services/ingredients/reducer';

import type { FC } from 'react';

import type {
  Ingredient,
  IngredientWithCount,
  OrderDetails as OrderType,
} from '@utils/types';

import styles from './order.module.css';

const order: OrderType = {
  _id: '1',
  number: 34534,
  status: 'pending',
  createdAt: '2021-06-23T14:43:22.587Z',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa0943',
    '643d69a5c3f7b9001cfa093f',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0944',
    '643d69a5c3f7b9001cfa0945',
    '643d69a5c3f7b9001cfa0946',
    '643d69a5c3f7b9001cfa0947',
    '643d69a5c3f7b9001cfa0948',
    '643d69a5c3f7b9001cfa0949',
    '643d69a5c3f7b9001cfa094a',
  ],
};

export const Order: FC = () => {
  const allIngredients = useAppSelector(getIngredients);

  console.log('ALL:', allIngredients);

  // Мемоизация для группировки ингредиентов и подсчета общей суммы
  const { groupedIngredients, total } = useMemo(() => {
    const ingredientsFull = order.ingredients
      .map((id) => allIngredients.find((item: Ingredient) => item._id === id))
      .filter(Boolean) as Ingredient[];

    const map = ingredientsFull.reduce<Record<string, IngredientWithCount>>(
      (acc, item) => {
        if (!acc[item._id]) {
          acc[item._id] = {
            ...item,
            count: item.type === 'bun' ? 2 : 1,
          };
        } else {
          acc[item._id].count += 1;
        }
        return acc;
      },
      {}
    );

    const grouped = Object.values(map);
    const totalPrice = grouped.reduce((sum, item) => sum + item.price * item.count, 0);

    return { groupedIngredients: grouped, total: totalPrice };
  }, [allIngredients, order.ingredients]);

  // Конфигурация статуса
  const statusConfig = useMemo(() => {
    switch (order.status) {
      case 'done':
        return { text: 'Выполнен', className: 'text_color_success' };
      case 'pending':
        return { text: 'Готовится', className: styles.statusPending };
      default:
        return { text: 'Отменён', className: styles.statusCanceled };
    }
  }, [order.status]);

  return (
    <div className={`${styles.wrapper} pt-10`}>
      <p className="text text_type_digits-default mb-10">#{order.number}</p>

      <h2 className="text text_type_main-medium mb-3">{'Детали заказа'}</h2>

      <p className={`text text_type_main-default mb-15 ${statusConfig.className}`}>
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
          {new Date(order.createdAt).toLocaleString()}
        </span>

        <div className={styles.total}>
          <span className="text text_type_digits-default mr-2">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
