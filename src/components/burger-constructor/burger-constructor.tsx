import {
  ConstructorElement,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, type FC, type RefCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import {
  addSelectedIngredient,
  getSelectedBun,
  getSelectedIngredients,
} from '@/services/burger-constructor/reducer';
import { incrementCount } from '@/services/ingredients/reducer';
import { createOrder } from '@/services/order/actions';
import { getOrderError, getOrderLoading } from '@/services/order/reducer';
import { getUserData } from '@/services/user/reducer';
import { DND_TYPES } from '@/utils/dnd-types';

import { ConstructorIngredient } from './constructor-ingredient/constructor-ingredient';

import type { DropIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUserData);
  const navigate = useNavigate();

  const selectedBun = useAppSelector(getSelectedBun);
  const selectedIngredients = useAppSelector(getSelectedIngredients);

  const useBunDrop = (): [RefCallback<HTMLDivElement>, boolean] => {
    const [{ isHover }, drop] = useDrop<DropIngredient, void, { isHover: boolean }>({
      accept: DND_TYPES.INGREDIENT,
      canDrop: (item) => item.type === 'bun',
      drop: (ingredient) => {
        dispatch(addSelectedIngredient(ingredient));
        dispatch(incrementCount(ingredient));
      },
      collect: (monitor) => ({
        isHover: monitor.isOver() && monitor.canDrop(),
      }),
    });

    const dropRef: RefCallback<HTMLDivElement> = useCallback(
      (node) => {
        if (node) {
          drop(node);
        }
      },
      [drop]
    );

    return [dropRef, isHover];
  };

  const [topBunDropRef, isTopBunHover] = useBunDrop();
  const [bottomBunDropRef, isBottomBunHover] = useBunDrop();

  const isBunHover = isTopBunHover || isBottomBunHover;

  const [{ isIngredientHover }, ingredientsDrop] = useDrop<
    DropIngredient,
    void,
    { isIngredientHover: boolean }
  >({
    accept: DND_TYPES.INGREDIENT,
    canDrop: (item) => item.type !== 'bun',
    drop: (ingredient) => {
      if (ingredient.index != null) return;
      dispatch(addSelectedIngredient(ingredient));
      dispatch(incrementCount(ingredient));
    },
    collect: (monitor) => ({
      isIngredientHover: monitor.isOver() && monitor.canDrop(),
    }),
  });

  const ingredientsDropRef: RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      ingredientsDrop(node);
    },
    [ingredientsDrop]
  );

  const totalPrice = useMemo(() => {
    return (
      (selectedBun ? selectedBun.price * 2 : 0) +
      selectedIngredients.reduce((acc, item) => acc + item.price, 0)
    );
  }, [selectedBun, selectedIngredients]);

  const orderLoading = useSelector(getOrderLoading);
  const orderError = useSelector(getOrderError);

  const isOrderDisabled =
    !selectedBun || selectedIngredients.length === 0 || orderLoading;

  const handleOrderClick = (): void => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!selectedBun || selectedIngredients.length === 0) return;

    const ingredientsIds = [
      selectedBun._id,
      ...selectedIngredients.map((item) => item._id),
      selectedBun._id,
    ];
    dispatch(createOrder(ingredientsIds));
  };

  return (
    <section className={styles.burger_constructor}>
      {/* Верхняя булка  */}
      {selectedBun ? (
        <div ref={topBunDropRef} className={styles.lockedItem}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${selectedBun.name} (верх)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
          />
        </div>
      ) : (
        <div
          ref={topBunDropRef}
          className={`${styles.placeholder} ${styles.top} ${isBunHover ? styles.hoverPlaceholder : ''}`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булки
          </p>
        </div>
      )}

      {/*  Начинки  */}
      <div ref={ingredientsDropRef} className={styles.items}>
        {selectedIngredients.length > 0 ? (
          selectedIngredients.map((item, idx) => (
            <ConstructorIngredient key={item.uid} ingredient={item} index={idx} />
          ))
        ) : (
          <div
            className={`${styles.placeholder} ${isIngredientHover ? styles.hoverPlaceholder : ''}`}
          >
            <p className="text text_type_main-default text_color_inactive">
              Выберите начинки
            </p>
          </div>
        )}
      </div>

      {/*  Нижняя булка  */}
      {selectedBun ? (
        <div ref={bottomBunDropRef} className={styles.lockedItem}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${selectedBun.name} (низ)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
          />
        </div>
      ) : (
        <div
          ref={bottomBunDropRef}
          className={`${styles.placeholder} ${styles.bottom} ${isBunHover ? styles.hoverPlaceholder : ''}`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булки
          </p>
        </div>
      )}

      {/*  Цена + кнопка  */}
      <div className={styles.orderRow}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderClick}
          disabled={isOrderDisabled}
        >
          {orderLoading ? 'Оформляем заказ…' : 'Оформить заказ'}
        </Button>
      </div>

      {orderError && (
        <div className={styles.error}>
          <p className="text text_type_main-default text_color_error">
            Не удалось оформить заказ. Попробуйте ещё раз.
          </p>
        </div>
      )}
    </section>
  );
};
