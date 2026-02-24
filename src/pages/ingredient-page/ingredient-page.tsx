import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import type { FC } from 'react';

import styles from './ingredient-page.module.css';
export const IngredientPage: FC = () => {
  return (
    <div className={styles.container}>
      <IngredientDetails />
    </div>
  );
};
