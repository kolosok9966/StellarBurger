import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { fetchIngredients } from '@/services/ingredients/actions';
import { profileOrdersWsConnect } from '@/services/profile-orders/action';
import { getCookie } from '@/utils/request';
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
    const accessToken = getCookie('accessToken');
    const wsUrl = `wss://norma.education-services.ru/orders?token=${accessToken}`;
    dispatch(profileOrdersWsConnect(wsUrl));
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
