import { useEffect, type FC } from 'react';

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import {
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
} from '@/services/profile-orders/action';
import { getProfileOrders } from '@/services/profile-orders/reducer';
import { getCookie } from '@/utils/request';

import { OrdersList } from '../orders-list/orders-list';

export const HistoryOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getProfileOrders);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const wsUrl = `wss://norma.education-services.ru/orders?token=${accessToken}`;
    dispatch(profileOrdersWsConnect(wsUrl));
    return (): void => {
      dispatch(profileOrdersWsDisconnect());
    };
  }, [dispatch]);

  return <OrdersList url={'/profile/orders'} orders={orders} showStatus={true} />;
};
