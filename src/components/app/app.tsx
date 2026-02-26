import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { fetchIngredients } from '@/services/ingredients/actions';
import { AppHeader } from '@components/app-header/app-header';
import { AppRoutes } from '@components/app-routes';
import { getUser } from '@services/user/actions';

import type { FC } from 'react';

import styles from './app.module.css';

export const App: FC = () => {
  const dispatch = useAppDispatch();

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
