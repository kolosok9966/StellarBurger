import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate } from 'react-router-dom';

import { useAppLocation } from '@/hooks/use-app-location';
import { useAppSelector } from '@/hooks/usea-app-selector';
import { getUserData, getIsAuthChecked } from '@/services/user/reducer';

import type { FC } from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
  anonymous?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false,
}) => {
  const user = useAppSelector(getUserData);
  const isAuthChecked = useAppSelector(getIsAuthChecked);
  const location = useAppLocation();

  if (!isAuthChecked) return <Preloader />;
  const from = location.state?.from || '/';
  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && user) return <Navigate to={from} replace />; // ...то отправляем его на предыдущую страницу
  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !user)
    return <Navigate to="/login" state={{ from: location }} replace />; // ...то отправляем его на страницу логин

  return children;
};
