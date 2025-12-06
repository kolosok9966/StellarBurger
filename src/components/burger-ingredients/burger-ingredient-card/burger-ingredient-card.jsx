import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import styles from './burger-ingredient-card.module.css';

export const BurgerIngredientCard = ({ item, handleSelect, handleOpenDetails }) => {
  BurgerIngredientCard.propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'main', 'sauce']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      count: PropTypes.number,
    }).isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleOpenDetails: PropTypes.func.isRequired,
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

      <div className={styles.text} onClick={() => handleOpenDetails(item)}>
        <div className={styles.priceRow}>
          <span className="text text_type_digits-default">{item.price}</span>
          <CurrencyIcon />
        </div>

        <p className={`text text_type_main-default ${styles.name}`}>{item.name}</p>
      </div>
    </div>
  );
};
