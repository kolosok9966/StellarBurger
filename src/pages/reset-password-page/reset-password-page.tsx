import {
  Button,
  PasswordInput,
  Input,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate, Navigate } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppLocation } from '@/hooks/use-app-location';
import { useAppSelector } from '@/hooks/usea-app-selector';
import { useForm } from '@hooks/useForm';
import { resetPassword } from '@services/user/actions';
import { getUserLoading } from '@services/user/reducer';

import type { FC } from 'react';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage: FC = () => {
  const location = useAppLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(getUserLoading);
  const { values, handleChange } = useForm({ password: '', code: '' });

  if (!location.state?.fromForgot) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(resetPassword({ password: values.password, token: values.code }))
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch(() => {
        console.log('Ошибка');
      });
  };

  return (
    <main className={styles.container}>
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-6">
          <PasswordInput
            value={values.password}
            name="password"
            placeholder="Введите новый пароль"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Введите код из письма"
            value={values.code}
            name="token"
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      </form>

      <p className="text text_type_main-default text_color_inactive">
        Вспомнили пароль?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </main>
  );
};

export default ResetPasswordPage;
