import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import { clearBurgerConstructor } from '@/services/burger-constructor/reducer';
import {
  getIngredientsLoading,
  getIngredientsError,
  clearCounts,
} from '@/services/ingredients/reducer';
import { getOrderNumber, clearOrder } from '@/services/order/reducer';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { OrderDetails } from '@components/burger-constructor/order-details/order-details';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';

import type { FC } from 'react';

import styles from './burger-constructor-page.module.css';

export const BurgerConstructorPage: FC = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(getIngredientsLoading);
  const error = useAppSelector(getIngredientsError);
  const orderNumber = useAppSelector(getOrderNumber);

  const handleCloseModalWithClear = (): void => {
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
    dispatch(clearCounts());
  };

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      <main className={`${styles.main} pl-5 pr-5`}>
        {loading && <Preloader />}
        {error && (
          <p className="text text_type_main-medium text_color_error">
            {' '}
            Ошибка при загрузке ингредиентов.
          </p>
        )}
        {!loading && !error && (
          <>
            <BurgerIngredients />
            <BurgerConstructor />
          </>
        )}
      </main>

      {orderNumber && (
        <Modal handleClose={handleCloseModalWithClear}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

export default BurgerConstructorPage;
