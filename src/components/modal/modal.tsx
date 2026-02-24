import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FC, type ReactElement } from 'react';
import ReactDOM from 'react-dom';

import ModalOverlay from './modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  handleClose: () => void;
  children: ReactElement;
};

export const Modal: FC<ModalProps> = ({ title, handleClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    return (): void => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <>
      <ModalOverlay handleClose={handleClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          {title && <h2 className="text text_type_main-large">{title}</h2>}

          <button className={styles.closeBtn} onClick={handleClose}>
            <CloseIcon type="primary" />
          </button>
        </div>

        {children}
      </div>
    </>,
    modalRoot
  );
};
