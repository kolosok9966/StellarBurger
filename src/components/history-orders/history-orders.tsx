import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FC } from 'react';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import {
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
} from '@/services/profile-orders/action';
import {
  getProfileConnectionError,
  getProfileOrders,
  getProfileReceivedMessage,
  getProfileStatus,
} from '@/services/profile-orders/reducer';
import { getCookie } from '@/utils/request';
import { WebsocketStatus } from '@/utils/types';

import { OrdersList } from '../orders-list/orders-list';

export const HistoryOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getProfileOrders);
  const error = useAppSelector(getProfileConnectionError);
  const status = useAppSelector(getProfileStatus);
  const receivedMessage = useAppSelector(getProfileReceivedMessage);

  useEffect(() => {
    const API_BASE_WSS_URL = import.meta.env.VITE_API_BASE_WSS_URL;
    const accessToken = getCookie('accessToken');
    const wsUrl = `${API_BASE_WSS_URL}/orders?token=${accessToken}`;
    dispatch(profileOrdersWsConnect(wsUrl));
    return (): void => {
      dispatch(profileOrdersWsDisconnect());
    };
  }, [dispatch]);

  if (error) {
    return (
      <p className="text text_type_main-medium text_color_error">Ошибка при загрузке.</p>
    );
  }

  if (status != WebsocketStatus.ONLINE || !receivedMessage) {
    return <Preloader />;
  }

  return <OrdersList url={'/profile/orders'} orders={orders} showStatus={true} />;
};
