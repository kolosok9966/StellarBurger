import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/usea-app-selector';
import { getIngredients, getIngredientsLoading } from '@/services/ingredients/reducer';

import type { Ingredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const loading = useAppSelector(getIngredientsLoading);
  const ingredients = useAppSelector(getIngredients);
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      const found = ingredients.find((item) => item._id === id);
      setIngredient(found || null);
    }
  }, [ingredients, id]);

  if (loading) return <p>Загрузка ингредиента...</p>;
  if (!ingredient) return <p>Ингредиент не найден</p>;

  return (
    <div className={styles.wrapper}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />

      <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>

      <ul className={styles.infoList}>
        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </p>
        </li>
        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </p>
        </li>
        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </p>
        </li>
        <li className={styles.infoItem}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};
