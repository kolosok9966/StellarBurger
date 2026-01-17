import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { loginUser } from '@services/user/actions';
import { getUserLoading, getUserError } from '@services/user/reducer';

import styles from './login-page.module.css';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getUserLoading);
  const error = useSelector(getUserError);
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(location.state?.from?.pathname || '/', { replace: true });
      })
      .catch(() => {
        console.log('Ошибка');
      });
  };

  return (
    <main className={styles.container}>
      <h2 className="text text_type_main-medium mb-6">Вход</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-6">
          <EmailInput
            value={email}
            name="email"
            placeholder="E-mail"
            isIcon={false}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <PasswordInput
            value={password}
            name="password"
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text text_type_main-small text_color_error mb-6">
            Неверный email или пароль
          </p>
        )}

        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
            Войти
          </Button>
        </div>
      </form>

      <p className="text text_type_main-default text_color_inactive mb-4">
        Вы — новый пользователь?{' '}
        <Link to="/register" className={styles.link}>
          Зарегистрироваться
        </Link>
      </p>

      <p className="text text_type_main-default text_color_inactive">
        Забыли пароль?{' '}
        <Link to="/forgot-password" className={styles.link}>
          Восстановить пароль
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;
