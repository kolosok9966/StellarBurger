import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { fetchIngredients } from '@/services/ingredients/actions';
import { AppHeader } from '@components/app-header/app-header';
import { AppRoutes } from '@components/app-routes';
import { getUser } from '@services/user/actions';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};
