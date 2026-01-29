import {
  Button,
  EmailInput,
  PasswordInput,
  Input,
} from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { registerUser } from '@services/user/actions';
import { getUserLoading, getUserError } from '@services/user/reducer';

import styles from './register-page.module.css';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getUserLoading);
  const error = useSelector(getUserError);
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({ name: values.name, email: values.email, password: values.password })
    )
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        console.log('Ошибка');
      });
  };

  return (
    <main className={styles.container}>
      <h2 className="text text_type_main-medium mb-6">Регистрация</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Имя"
            value={values.name}
            name="name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <EmailInput
            value={values.email}
            name="email"
            placeholder="E-mail"
            isIcon={false}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <PasswordInput
            value={values.password}
            name="password"
            placeholder="Пароль"
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="text text_type_main-small text_color_error mb-6">
            Неудалось зарегистрироваться. Попробуйте еще раз.
          </p>
        )}

        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
            Зарегистрироваться
          </Button>
        </div>
      </form>

      <p className="text text_type_main-default text_color_inactive">
        Уже зарегистрированы?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </main>
  );
};

export default RegisterPage;
