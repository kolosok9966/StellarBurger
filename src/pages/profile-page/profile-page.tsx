import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { logoutUser } from '@services/user/actions';

import type { FC } from 'react';

import styles from './profile-page.module.css';

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logoutUser()).then(() => {
      navigate('/login', { replace: true, state: {} });
    });
  };

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ` +
            (isActive ? 'text_color_primary' : 'text_color_inactive')
          }
        >
          Профиль
        </NavLink>

        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ` +
            (isActive ? 'text_color_primary' : 'text_color_inactive')
          }
        >
          История заказов
        </NavLink>

        <button
          className={`${styles.link} text text_type_main-medium text_color_inactive`}
          onClick={handleLogout}
        >
          Выход
        </button>

        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  );
};
