import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getSelectedBun,
  getSelectedIngredients,
  removeSelectedIngredient,
} from '@/services/burger-constructor/reducer';
import { decrementCount } from '@/services/ingredients/reducer';
import { createOrder } from '@/services/order/actions';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const selectedBun = useSelector(getSelectedBun);
  const selectedIngredients = useSelector(getSelectedIngredients);

  const totalPrice = useMemo(() => {
    return (
      (selectedBun ? selectedBun.price * 2 : 0) +
      selectedIngredients.reduce((acc, item) => acc + item.price, 0)
    );
  }, [selectedBun, selectedIngredients]);

  const handleDeleteSelectIngredient = (ingredient) => {
    dispatch(removeSelectedIngredient(ingredient));
    dispatch(decrementCount(ingredient));
  };

  const handleOrderClick = () => {
    const ingredientsIds = [
      selectedBun._id,
      ...selectedIngredients.map((item) => item._id),
      selectedBun._id,
    ];
    dispatch(createOrder(ingredientsIds));
  };

  return (
    <section className={styles.burger_constructor}>
      {selectedBun && (
        <>
          {/* Верхняя булка  */}
          <div className={styles.lockedItem}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${selectedBun.name} (верх)`}
              price={selectedBun.price}
              thumbnail={selectedBun.image}
            />
          </div>

          {/*  Начинки  */}
          <div className={styles.items}>
            {selectedIngredients.map((item, idx) => (
              <div key={idx} className={styles.item}>
                <DragIcon type="primary" />
                <ConstructorElement
                  text={item.name}
                  price={item.price}
                  thumbnail={item.image}
                  handleClose={() => handleDeleteSelectIngredient(item)}
                />
              </div>
            ))}
          </div>

          {/*  Нижняя булка  */}
          <div className={styles.lockedItem}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${selectedBun.name} (низ)`}
              price={selectedBun.price}
              thumbnail={selectedBun.image}
            />
          </div>

          {/*  Цена + кнопка  */}
          <div className={styles.orderRow}>
            <div className={styles.price}>
              <span className="text text_type_digits-medium">{totalPrice}</span>
              <CurrencyIcon />
            </div>

            <Button
              htmlType="button"
              type="primary"
              size="large"
              onClick={handleOrderClick}
            >
              Оформить заказ
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
