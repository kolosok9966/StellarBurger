import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState, useEffect } from 'react';

import { IngredientType } from '@utils/types';

import { BurgerIngredientCard } from './burger-ingredient-card/burger-ingredient-card';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({
  ingredients,
  handleSelectIngredient,
  handleOpenDetails,
}) => {
  BurgerIngredients.propTypes = {
    ingredients: PropTypes.arrayOf(IngredientType).isRequired,
    handleSelectIngredient: PropTypes.func.isRequired,
    handleOpenDetails: PropTypes.func.isRequired,
  };

  const [current, setCurrent] = useState('bun');

  const containerRef = useRef(null);
  const bunRef = useRef(null);
  const mainRef = useRef(null);
  const sauceRef = useRef(null);

  const groups = useMemo(
    () => ({
      bun: ingredients.filter((i) => i.type === 'bun'),
      main: ingredients.filter((i) => i.type === 'main'),
      sauce: ingredients.filter((i) => i.type === 'sauce'),
    }),
    [ingredients]
  );

  // 👉 Скролл при клике по табу
  const handleTabClick = (tab) => {
    setCurrent(tab);

    const refs = {
      bun: bunRef,
      main: mainRef,
      sauce: sauceRef,
    };

    refs[tab].current.scrollIntoView({ behavior: 'smooth' });
  };

  // 👉 Авто-смена таба при прокрутке
  useEffect(() => {
    const container = containerRef.current;

    const onScroll = () => {
      const containerTop = container.getBoundingClientRect().top;

      const distances = {
        bun: Math.abs(bunRef.current.getBoundingClientRect().top - containerTop),
        main: Math.abs(mainRef.current.getBoundingClientRect().top - containerTop),
        sauce: Math.abs(sauceRef.current.getBoundingClientRect().top - containerTop),
      };

      const closest = Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0];
      setCurrent(closest);
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      {/* -------- Tabs -------- */}
      <nav>
        <div className={styles.menu}>
          <Tab
            value="bun"
            active={current === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>

          <Tab
            value="main"
            active={current === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>

          <Tab
            value="sauce"
            active={current === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
        </div>
      </nav>

      {/* -------- List -------- */}
      <div className={styles.listContainer} ref={containerRef}>
        {/* Булки */}
        <div ref={bunRef} className={styles.section}>
          <h2 className="text text_type_main-medium">Булки</h2>
          <ul className={styles.grid}>
            {groups.bun.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
                handleOpenDetails={handleOpenDetails}
              />
            ))}
          </ul>
        </div>

        {/* Начинки */}
        <div ref={mainRef} className={styles.section}>
          <h2 className="text text_type_main-medium">Начинки</h2>
          <ul className={styles.grid}>
            {groups.main.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
                handleOpenDetails={handleOpenDetails}
              />
            ))}
          </ul>
        </div>

        {/* Соусы */}
        <div ref={sauceRef} className={styles.section}>
          <h2 className="text text_type_main-medium">Соусы</h2>
          <ul className={styles.grid}>
            {groups.sauce.map((item) => (
              <BurgerIngredientCard
                key={item._id}
                item={item}
                handleSelect={handleSelectIngredient}
                handleOpenDetails={handleOpenDetails}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
