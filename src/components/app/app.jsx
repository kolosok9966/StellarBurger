import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { request } from '@/utils/request';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';

import { OrderDetails } from '../burger-constructor/order-details/order-details';
import { IngredientDetails } from '../burger-ingredients/ingredient-details/ingredient-details';

import styles from './app.module.css';

export const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedBun, setSelectedBun] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const openIngredientModal = (item) => setCurrentIngredient(item);
  const closeIngredientModal = () => setCurrentIngredient(null);

  const handleSelectIngredient = (item) => {
    if (item.type === 'bun') {
      setSelectedBun(item);
    } else {
      setSelectedIngredients((prev) => [...prev, { ...item, uid: crypto.randomUUID() }]);
    }

    setIngredients((prev) =>
      prev.map((ing) => {
        if (item.type === 'bun') {
          if (ing.type === 'bun') {
            return { ...ing, count: ing._id === item._id ? 2 : 0 };
          }
          return ing;
        }
        if (ing._id === item._id) {
          return { ...ing, count: (ing.count || 0) + 1 };
        }
        return ing;
      })
    );
  };

  const handleDeleteSelectIngredient = (item) => {
    setSelectedIngredients((prev) => prev.filter((ing) => ing.uid !== item.uid));

    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing._id === item._id) {
          return { ...ing, count: ing.count - 1 };
        }
        return ing;
      })
    );
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const data = await request('/ingredients');
        const ingredientsList = data.data || [];
        setIngredients(ingredientsList);
        const defaultBun = ingredientsList.find((item) => item.type === 'bun');
        if (defaultBun) {
          handleSelectIngredient(defaultBun);
        } else throw new Error();
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        {loading && <Preloader />}
        {error && (
          <p className="text text_type_main-medium text_color_error">
            {' '}
            Ошибка при загрузке ингредиентов.
          </p>
        )}
        {!loading && !error && (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              handleSelectIngredient={handleSelectIngredient}
              handleOpenDetails={openIngredientModal}
            />
            <BurgerConstructor
              selectedBun={selectedBun}
              selectedIngredients={selectedIngredients}
              handleDeleteSelectIngredient={handleDeleteSelectIngredient}
              handleOrderClick={openOrderModal}
            />
          </>
        )}
      </main>

      {isOrderModalOpen && (
        <Modal handleClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}

      {currentIngredient && (
        <Modal title={'Детали ингредиента'} handleClose={closeIngredientModal}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
    </div>
  );
};
