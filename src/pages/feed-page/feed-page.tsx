import { useEffect, type FC } from 'react';

import { OrdersList } from '@/components/orders-list/orders-list';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/usea-app-selector';
import {
  feedOrdersWsConnect,
  feedOrdersWsDisconnect,
} from '@/services/feed-orders/action';
import {
  getFeedLastDoneOrders,
  getFeedOrders,
  getFeedLastPendingOrders,
  getFeedTotal,
  getFeedTotalToday,
} from '@/services/feed-orders/reducer';

import styles from './feed-page.module.css';

export const FeedPage: FC = () => {
  const dispatch = useAppDispatch();
  const total = useAppSelector(getFeedTotal);
  const totalToday = useAppSelector(getFeedTotalToday);
  const feedOrders = useAppSelector(getFeedOrders);
  const doneOrders = useAppSelector(getFeedLastDoneOrders);
  const pendingOrders = useAppSelector(getFeedLastPendingOrders);

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const pendingChunks = chunkArray(pendingOrders, 10);

  useEffect(() => {
    dispatch(feedOrdersWsConnect('wss://norma.education-services.ru/orders/all'));
    return (): void => {
      dispatch(feedOrdersWsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>

      <div className={styles.content}>
        {/* LEFT COLUMN — ORDERS */}
        <OrdersList orders={feedOrders} url={'/feed'} />

        {/* RIGHT COLUMN — STATS */}
        <div className={styles.stats}>
          <div className="mb-15">
            <div className={styles.statusBlock}>
              <div>
                <p className="text text_type_main-medium mb-4">Готовы:</p>
                <div className={styles.readyList}>
                  {doneOrders.map((order) => (
                    <span
                      key={order}
                      className="text text_type_digits-default text_color_success"
                    >
                      {order}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text text_type_main-medium mb-4">В работе:</p>
                <div className={styles.columns}>
                  {pendingChunks.map((column, index) => (
                    <div key={index} className={styles.column}>
                      {column.map((order) => (
                        <span key={order} className="text text_type_digits-default">
                          {order}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-15">
            <p className="text text_type_main-medium mb-2">Выполнено за все время:</p>
            <p className="text text_type_digits-large">{total}</p>
          </div>

          <div>
            <p className="text text_type_main-medium mb-2">Выполнено за сегодня:</p>
            <p className="text text_type_digits-large">{totalToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
