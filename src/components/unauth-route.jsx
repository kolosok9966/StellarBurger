import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { getUserData, getIsAuthChecked } from '@/services/user/reducer';

export const UnAuthRoute = ({ element, redirectTo = '/' }) => {
  UnAuthRoute.propTypes = {
    element: PropTypes.node.isRequired,
    redirectTo: PropTypes.string,
  };
  const user = useSelector(getUserData);
  const isAuthChecked = useSelector(getIsAuthChecked);

  if (!isAuthChecked) return <Preloader />;

  return user ? <Navigate to={redirectTo} replace /> : element;
};
