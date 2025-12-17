import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearCurrentIngredient,
  getCurrentIngredient,
} from '@/services/current-ingredient/reducer';
import { fetchIngredients } from '@/services/ingredients/actions';
import {
  getIngredientsLoading,
  getIngredientsError,
} from '@/services/ingredients/reducer';
import { clearOrder, getOrderNumber } from '@/services/order/reducer';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';

import { OrderDetails } from '../burger-constructor/order-details/order-details';
import { IngredientDetails } from '../burger-ingredients/ingredient-details/ingredient-details';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const loading = useSelector(getIngredientsLoading);
  const error = useSelector(getIngredientsError);

  const currentIngredient = useSelector(getCurrentIngredient);
  const orderNumber = useSelector(getOrderNumber);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
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
        <Modal handleClose={() => dispatch(clearOrder())}>
          <OrderDetails />
        </Modal>
      )}

      {currentIngredient && (
        <Modal
          title={'Детали ингредиента'}
          handleClose={() => dispatch(clearCurrentIngredient())}
        >
          <IngredientDetails />
        </Modal>
      )}
    </div>
  );
};
