import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, type FC, type RefCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setCurrentIngredient } from '@/services/current-ingredient/reducer';
import { DND_TYPES } from '@/utils/dnd-types';

import type { Ingredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type BurgerIngredientCardProps = {
  item: Ingredient;
};

export const BurgerIngredientCard: FC<BurgerIngredientCardProps> = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [, drag] = useDrag(() => ({
    type: DND_TYPES.INGREDIENT,
    item: { ...item },
  }));

  const dragRef: RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      drag(node);
    },
    [drag]
  );

  const handleClick = (): void => {
    dispatch(setCurrentIngredient(item));
    navigate(`/ingredients/${item._id}`, { state: { background: location } });
  };

  return (
    <div
      ref={dragRef}
      className={styles.card}
      onClick={handleClick}
      data-cy="ingredient-card"
      data-type={item.type}
    >
      {item.count !== undefined && item.count > 0 && (
        <div className={styles.counter}>
          <Counter count={item.count} size="default" />
        </div>
      )}

      <img className={styles.image} src={item.image} alt={item.name} />

      <div className={styles.text}>
        <div className={styles.priceRow}>
          <span className="text text_type_digits-default">{item.price}</span>
          <CurrencyIcon type="primary" />
        </div>

        <p
          className={`text text_type_main-default ${styles.name}`}
          data-cy="ingredient-name"
        >
          {item.name}
        </p>
      </div>
    </div>
  );
};
