import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';

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

import styles from './burger-constructor-page.module.css';

export const BurgerConstructorPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getIngredientsLoading);
  const error = useSelector(getIngredientsError);
  const orderNumber = useSelector(getOrderNumber);

  const handleCloseModalWithClear = () => {
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
