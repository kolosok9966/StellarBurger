import type { FC } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  handleClose: () => void;
};

const ModalOverlay: FC<ModalOverlayProps> = ({ handleClose }) => {
  return <div className={styles.overlay} onClick={handleClose} />;
};

export default ModalOverlay;
