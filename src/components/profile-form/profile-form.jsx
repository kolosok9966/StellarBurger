import {
  Button,
  Input,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, updateUser } from '@services/user/actions';
import { getUserData, getUserLoading } from '@services/user/reducer';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const isLoading = useSelector(getUserLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialData, setInitialData] = useState(null);

  const isEdited =
    initialData &&
    (name !== initialData.name || email !== initialData.email || password);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    } else {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setInitialData({ name: user.name, email: user.email });
    }
  }, [dispatch, user]);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUser({ name, email, password: password || undefined }));
    setPassword('');
  };

  const handleCancel = () => {
    setName(initialData.name);
    setEmail(initialData.email);
    setPassword('');
  };

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <div className="mb-6">
        <Input
          value={name}
          name="name"
          placeholder="Имя"
          icon="EditIcon"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <EmailInput
          value={email}
          name="email"
          placeholder="Логин"
          icon="EditIcon"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <PasswordInput
          value={password}
          name="password"
          placeholder="Пароль"
          icon="EditIcon"
          onChange={(e) => setPassword(e.target.value)}
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
