import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { setCurrentIngredient } from '@/services/current-ingredient/reducer';
import { DND_TYPES } from '@/utils/dnd-types';
import { IngredientType } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

export const BurgerIngredientCard = ({ item }) => {
  BurgerIngredientCard.propTypes = {
    item: IngredientType.isRequired,
  };
  const dispatch = useDispatch();

  const [, dragRef] = useDrag({
    type: DND_TYPES.INGREDIENT,
    item: {
      ...item,
      from: 'menu',
    },
  });

  return (
    <div
      ref={dragRef}
      className={styles.card}
      onClick={() => dispatch(setCurrentIngredient(item))}
    >
      {item.count > 0 && (
        <div className={styles.counter}>
          <Counter count={item.count} size="default" />
        </div>
      )}

      <img className={styles.image} src={item.image} alt={item.name} />

      <div className={styles.text}>
        <div className={styles.priceRow}>
          <span className="text text_type_digits-default">{item.price}</span>
          <CurrencyIcon />
        </div>

        <p className={`text text_type_main-default ${styles.name}`}>{item.name}</p>
      </div>
    </div>
  );
};
