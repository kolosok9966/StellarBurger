import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect, type FC } from 'react';

import { useAppSelector } from '@/hooks/usea-app-selector';
import {
  getIngredientsBuns,
  getIngredientsMains,
  getIngredientsSauces,
} from '@/services/ingredients/reducer';

import { BurgerIngredientCard } from './burger-ingredient-card/burger-ingredient-card';

import styles from './burger-ingredients.module.css';

type TabValue = 'bun' | 'main' | 'sauce';

export const BurgerIngredients: FC = () => {
  const buns = useAppSelector(getIngredientsBuns);
  const mains = useAppSelector(getIngredientsMains);
  const sauces = useAppSelector(getIngredientsSauces);

  const [current, setCurrent] = useState<TabValue>('bun');
  const containerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);

  // 👉 Скролл при клике по табу
  const handleTabClick = (tab: TabValue): void => {
    setCurrent(tab);

    const refs = {
      bun: bunRef,
      main: mainRef,
      sauce: sauceRef,
    };

    refs[tab].current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 👉 Авто-смена таба при прокрутке
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = (): void => {
      if (!bunRef.current || !mainRef.current || !sauceRef.current) return;
      const containerTop = container.getBoundingClientRect().top;

      const distances = {
        bun: Math.abs(bunRef.current.getBoundingClientRect().top - containerTop),
        main: Math.abs(mainRef.current.getBoundingClientRect().top - containerTop),
        sauce: Math.abs(sauceRef.current.getBoundingClientRect().top - containerTop),
      };

      const closest = Object.entries(distances).sort(
        (a, b) => a[1] - b[1]
      )[0][0] as TabValue;
      setCurrent(closest);
    };

    container.addEventListener('scroll', onScroll);
    return (): void => container.removeEventListener('scroll', onScroll);
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
            {buns.map((item) => (
              <BurgerIngredientCard key={item._id} item={item} />
            ))}
          </ul>
        </div>

        {/* Начинки */}
        <div ref={mainRef} className={styles.section}>
          <h2 className="text text_type_main-medium">Начинки</h2>
          <ul className={styles.grid}>
            {mains.map((item) => (
              <BurgerIngredientCard key={item._id} item={item} />
            ))}
          </ul>
        </div>

        {/* Соусы */}
        <div ref={sauceRef} className={styles.section}>
          <h2 className="text text_type_main-medium">Соусы</h2>
          <ul className={styles.grid}>
            {sauces.map((item) => (
              <BurgerIngredientCard key={item._id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
