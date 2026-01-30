import {
  Button,
  Input,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FC } from 'react';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import { useForm } from '@hooks/useForm';
import { getUser, updateUser } from '@services/user/actions';
import { getUserData, getUserLoading } from '@services/user/reducer';

import styles from './profile-form.module.css';

type ProfileFormValues = {
  name: string;
  email: string;
  password: string;
};

type InitialData = {
  name: string;
  email: string;
};

export const ProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUserData);
  const isLoading = useAppSelector(getUserLoading);

  const { values, handleChange, setValues } = useForm<ProfileFormValues>({
    name: '',
    email: '',
    password: '',
  });

  const [initialData, setInitialData] = useState<InitialData | null>(null);

  const isEdited =
    !!initialData &&
    (values.name !== initialData.name ||
      values.email !== initialData.email ||
      values.password.length > 0);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    } else {
      setValues({ name: user.name, email: user.email, password: '' });
      setInitialData({ name: user.name, email: user.email });
    }
  }, [dispatch, user]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
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

  const handleCancel = (): void => {
    if (!initialData) return;
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
