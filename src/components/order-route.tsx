import { Route, useNavigate } from 'react-router-dom';

import { Modal } from './modal/modal';
import { Order } from './order/order';

import type { FC } from 'react';

export const OrderRoute: FC = () => {
  const navigate = useNavigate();

  return (
    <>
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
          <Modal title={'Детали заказа'} handleClose={() => navigate(-1)}>
            <Order />
          </Modal>
        }
      />
    </>
  );
};
