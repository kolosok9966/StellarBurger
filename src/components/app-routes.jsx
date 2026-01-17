import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorPage } from '@/pages/burger-constructor-page/burger-constructor-page';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProfileForm } from '@components/profile-form/profile-form';
import { ProtectedRoute } from '@components/protected-route';
import { UnAuthRoute } from '@components/unauth-route';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login-page/login-page';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';

export const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Routes location={state?.background || location}>
        <Route path="/" element={<BurgerConstructorPage />} />
        <Route path="/login" element={<UnAuthRoute element={<LoginPage />} />} />
        <Route path="/register" element={<UnAuthRoute element={<RegisterPage />} />} />
        <Route
          path="/forgot-password"
          element={<UnAuthRoute element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<UnAuthRoute element={<ResetPasswordPage />} />}
        />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />}>
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<div>История заказов (заглушка)</div>} />
        </Route>
        <Route path="/ingredients/:id" element={<IngredientPage />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal handleClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
