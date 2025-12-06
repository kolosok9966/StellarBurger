import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { BurgerIngredientCard } from '../burger-ingredients/burger-ingredient-card/burger-ingredient-card';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients, handleSelectIngredient }) => {
  const groups = useMemo(() => {
    return {
      bun: ingredients.filter((i) => i.type === 'bun'),
      main: ingredients.filter((i) => i.type === 'main'),
      sauce: ingredients.filter((i) => i.type === 'sauce'),
    };
  }, [ingredients]);

  console.log(ingredients);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <div className={styles.listContainer}>
        {/* Булки */}
        <div data-type="bun" className={styles.section}>
          <h2 className="text text_type_main-medium">Булки</h2>
          <ul className={styles.grid}>
            {groups.bun.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
              />
            ))}
          </ul>
        </div>

        {/* Начинки */}
        <div data-type="main" className={styles.section}>
          <h2 className="text text_type_main-medium">Начинки</h2>
          <ul className={styles.grid}>
            {groups.main.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
              />
            ))}
          </ul>
        </div>

        {/* Соусы */}
        <div data-type="sauce" className={styles.section}>
          <h2 className="text text_type_main-medium">Соусы</h2>
          <ul className={styles.grid}>
            {groups.sauce.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
