import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { forgotPassword } from '@services/user/actions';
import { getUserLoading } from '@services/user/reducer';

import styles from './forgot-password-page.module.css';

export const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(getUserLoading);

  const { values, handleChange } = useForm({ email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email: values.email }))
      .unwrap()
      .then(() => {
        navigate('/reset-password', { state: { fromForgot: true } });
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
          <EmailInput
            value={values.email}
            name="email"
            placeholder="Укажите e-mail"
            isIcon={false}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Восстановить
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

export default ForgotPasswordPage;
