import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({
  selectedBun,
  selectedIngredients,
  handleDeleteSelectIngredient,
  handleOrderClick,
}) => {
  BurgerConstructor.propTypes = {
    selectedBun: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    }),
    selectedIngredients: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['main', 'sauce']).isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        uid: PropTypes.string.isRequired,
      })
    ).isRequired,
    handleDeleteSelectIngredient: PropTypes.func.isRequired,
    handleOrderClick: PropTypes.func.isRequired,
  };

  // ---- Общая стоимость ----
  const totalPrice =
    (selectedBun ? selectedBun.price * 2 : 0) +
    selectedIngredients.reduce((acc, item) => acc + item.price, 0);

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
