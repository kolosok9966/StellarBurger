import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import {
  addSelectedIngredient,
  getSelectedBun,
  getSelectedIngredients,
  removeSelectedIngredient,
} from '@/services/burger-constructor/reducer';
import { decrementCount, incrementCount } from '@/services/ingredients/reducer';
import { createOrder } from '@/services/order/actions';
import { DND_TYPES } from '@/utils/dnd-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const selectedBun = useSelector(getSelectedBun);
  const selectedIngredients = useSelector(getSelectedIngredients);

  const useBunDrop = (dispatch) => {
    const [{ isHover }, dropRef] = useDrop({
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
    return [dropRef, isHover];
  };

  const [topBunDropRef, isTopBunHover] = useBunDrop(dispatch);
  const [bottomBunDropRef, isBottomBunHover] = useBunDrop(dispatch);

  const isBunHover = isTopBunHover || isBottomBunHover;

  const [{ isIngredientHover }, ingredientsDropRef] = useDrop({
    accept: DND_TYPES.INGREDIENT,
    canDrop: (item) => item.type !== 'bun',
    drop: (ingredient) => {
      dispatch(addSelectedIngredient(ingredient));
      dispatch(incrementCount(ingredient));
    },
    collect: (monitor) => ({
      isIngredientHover: monitor.isOver() && monitor.canDrop(),
    }),
  });

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
            <div key={idx} className={styles.item}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
                handleClose={() => handleDeleteSelectIngredient(item)}
              />
            </div>
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
          <CurrencyIcon />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
