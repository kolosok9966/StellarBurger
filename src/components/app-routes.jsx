import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorPage } from '@/pages/burger-constructor-page/burger-constructor-page';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProfileForm } from '@components/profile-form/profile-form';
import { ProtectedRoute } from '@components/protected-route';
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

        {/* Страницы для неавторизованных пользователей */}
        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute anonymous>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute anonymous>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute anonymous>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Страницы для авторизованных пользователей */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<div>История заказов (заглушка)</div>} />
        </Route>

        {/* Страница ингредиента */}
        <Route path="/ingredients/:id" element={<IngredientPage />} />
      </Routes>

      {/* Модальное окно ингредиента */}
      {state?.background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title={'Детали ингредиента'} handleClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
