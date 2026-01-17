import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { getUserData, getIsAuthChecked } from '@/services/user/reducer';

export const ProtectedRoute = ({ element }) => {
  ProtectedRoute.propTypes = {
    element: PropTypes.node.isRequired,
  };
  const user = useSelector(getUserData);
  const isAuthChecked = useSelector(getIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    return element;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
