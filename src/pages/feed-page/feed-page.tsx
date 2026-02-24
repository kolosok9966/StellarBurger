import { OrdersList } from '@/components/orders-list/orders-list';

import type { FC } from 'react';

import styles from './feed-page.module.css';

export const FeedPage: FC = () => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>

      <div className={styles.content}>
        {/* LEFT COLUMN — ORDERS */}
        <OrdersList />

        {/* RIGHT COLUMN — STATS */}
        <div className={styles.stats}>
          <div className="mb-15">
            <div className={styles.statusBlock}>
              <div>
                <p className="text text_type_main-medium mb-4">Готовы:</p>
                <div className={styles.readyList}>
                  <span className="text text_type_digits-default text_color_success">
                    034533
                  </span>
                  <span className="text text_type_digits-default text_color_success">
                    034532
                  </span>
                  <span className="text text_type_digits-default text_color_success">
                    034530
                  </span>
                </div>
              </div>

              <div>
                <p className="text text_type_main-medium mb-4">В работе:</p>
                <div>
                  <span className="text text_type_digits-default">034538</span>
                  <span className="text text_type_digits-default">034541</span>
                  <span className="text text_type_digits-default">034542</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-15">
            <p className="text text_type_main-medium mb-2">Выполнено за все время:</p>
            <p className="text text_type_digits-large">28 752</p>
          </div>

          <div>
            <p className="text text_type_main-medium mb-2">Выполнено за сегодня:</p>
            <p className="text text_type_digits-large">138</p>
          </div>
        </div>
      </div>
    </div>
  );
};
