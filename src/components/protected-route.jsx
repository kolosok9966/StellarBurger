import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { getUserData, getIsAuthChecked } from '@/services/user/reducer';

export const ProtectedRoute = ({ children, anonymous = false }) => {
  const user = useSelector(getUserData);
  const isAuthChecked = useSelector(getIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;
  const from = location.state?.from || '/';
  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && user) return <Navigate to={from} replace />; // ...то отправляем его на предыдущую страницу
  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !user)
    return <Navigate to="/login" state={{ from: location }} replace />; // ...то отправляем его на страницу логин

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  anonymous: PropTypes.bool,
};
