import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { getOrderNumber } from '@/services/order/reducer';

import styles from './order-details.module.css';

export const OrderDetails = () => {
  const orderNumber = useSelector(getOrderNumber);
  const padded = orderNumber.toString().padStart(6, '0');

  return (
    <div className={styles.wrapper}>
      <p className="text text_type_digits-large mt-15 mb-8">{padded}</p>

      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>

      <div className={styles.iconWrapper}>
        <CheckMarkIcon type="primary" />
      </div>

      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>

      <p className="text text_type_main-small text_color_inactive mb-15">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
