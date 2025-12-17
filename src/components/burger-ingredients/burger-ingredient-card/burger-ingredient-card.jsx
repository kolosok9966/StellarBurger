import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';

import { addSelectedIngredient } from '@/services/burger-constructor/reducer';
import { setCurrentIngredient } from '@/services/current-ingredient/reducer';
import { incrementCount } from '@/services/ingredients/reducer';
import { IngredientType } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

export const BurgerIngredientCard = ({ item }) => {
  BurgerIngredientCard.propTypes = {
    item: IngredientType.isRequired,
  };
  const dispatch = useDispatch();

  const handleSelect = (ingredient) => {
    dispatch(addSelectedIngredient(ingredient));
    dispatch(incrementCount(ingredient));
  };

  return (
    <div className={styles.card}>
      {item.count > 0 && (
        <div className={styles.counter}>
          <Counter count={item.count} size="default" />
        </div>
      )}

      <img
        className={styles.image}
        src={item.image}
        alt={item.name}
        onClick={() => handleSelect(item)}
      />

      <div className={styles.text} onClick={() => dispatch(setCurrentIngredient(item))}>
        <div className={styles.priceRow}>
          <span className="text text_type_digits-default">{item.price}</span>
          <CurrencyIcon />
        </div>

        <p className={`text text_type_main-default ${styles.name}`}>{item.name}</p>
      </div>
    </div>
  );
};
