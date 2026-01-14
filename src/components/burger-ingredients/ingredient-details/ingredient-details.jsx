import { useSelector } from 'react-redux';

import { getCurrentIngredient } from '@/services/current-ingredient/reducer';

import styles from './ingredient-details.module.css';

export const IngredientDetails = () => {
  const currentIngredient = useSelector(getCurrentIngredient);

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.image}
        src={currentIngredient.image_large}
        alt={currentIngredient.name}
      />

      <p className="text text_type_main-medium mt-4 mb-8">{currentIngredient.name}</p>

      <ul className={styles.infoList}>
        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {currentIngredient.calories}
          </p>
        </li>

        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {currentIngredient.proteins}
          </p>
        </li>

        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {currentIngredient.fat}
          </p>
        </li>

        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {currentIngredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};
