import {
  Button,
  Input,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '@hooks/useForm';
import { getUser, updateUser } from '@services/user/actions';
import { getUserData, getUserLoading } from '@services/user/reducer';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const isLoading = useSelector(getUserLoading);

  const { values, handleChange, setValues } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [initialData, setInitialData] = useState(null);

  const isEdited =
    initialData &&
    (values.name !== initialData.name ||
      values.email !== initialData.email ||
      values.password);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    } else {
      setValues({ name: user.name, email: user.email, password: '' });
      setInitialData({ name: user.name, email: user.email });
    }
  }, [dispatch, user]);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: values.name,
        email: values.email,
        password: values.password || undefined,
      })
    );
    setValues({ ...values, password: '' });
  };

  const handleCancel = () => {
    setValues({
      ...values,
      name: initialData.name,
      email: initialData.email,
      password: '',
    });
  };

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <div className="mb-6">
        <Input
          value={values.name}
          name="name"
          placeholder="Имя"
          icon="EditIcon"
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <EmailInput
          value={values.email}
          name="email"
          placeholder="Логин"
          icon="EditIcon"
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <PasswordInput
          value={values.password}
          name="password"
          placeholder="Пароль"
          icon="EditIcon"
          onChange={handleChange}
        />
      </div>

      {isEdited && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
