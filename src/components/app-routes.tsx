import { Routes, Route, useNavigate } from 'react-router-dom';

import { useAppLocation } from '@/hooks/use-app-location';
import { BurgerConstructorPage } from '@/pages/burger-constructor-page/burger-constructor-page';
import { FeedPage } from '@/pages/feed-page/feed-page';
import { RegisterPage } from '@/pages/register-page/register-page';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProfileForm } from '@components/profile-form/profile-form';
import { ProtectedRoute } from '@components/protected-route';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login-page/login-page';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';

import { HistoryOrders } from './history-orders/history-orders';
import { Order } from './order/order';

import type { FC } from 'react';

export const AppRoutes: FC = () => {
  const navigate = useNavigate();
  const location = useAppLocation();

  return (
    <>
      <Routes location={location.state?.background || location}>
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
          <Route path="orders" element={<HistoryOrders />} />
        </Route>

        {/* Страница ингредиента */}
        <Route path="/ingredients/:id" element={<IngredientPage />} />

        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:number" element={<Order />} />
        <Route
          path="profile/orders/:number"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Модальное окно ингредиента */}
      {location.state?.background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title={'Детали ингредиента'} handleClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal handleClose={() => navigate(-1)}>
                <Order />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal handleClose={() => navigate(-1)}>
                  <Order />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
