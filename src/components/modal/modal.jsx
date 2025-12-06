import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import ModalOverlay from '../modal/modal-overlay/modal-overlay';

import styles from './modal.module.css';

export const Modal = ({ title, handleClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

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
    document.getElementById('modal-root')
  );
};
