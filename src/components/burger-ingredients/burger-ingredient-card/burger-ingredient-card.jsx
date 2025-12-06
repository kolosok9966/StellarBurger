import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-ingredient-card.module.css';

export const BurgerIngredientCard = ({ item, handleSelect }) => {
  return (
    <li className={styles.card} onClick={() => handleSelect(item)}>
      {item.count > 0 && (
        <div className={styles.counter}>
          <Counter count={item.count} size="default" />
        </div>
      )}

      <img className={styles.image} src={item.image} alt={item.name} />

      <div className={styles.priceRow}>
        <span className="text text_type_digits-default">{item.price}</span>
        <CurrencyIcon />
      </div>

      <p className={`text text_type_main-default ${styles.name}`}>{item.name}</p>
    </li>
  );
};
