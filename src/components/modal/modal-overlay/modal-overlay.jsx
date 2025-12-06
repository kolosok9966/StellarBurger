import styles from './modal-overlay.module.css';

const ModalOverlay = ({ handleClose }) => {
  return <div className={styles.overlay} onClick={handleClose} />;
};

export default ModalOverlay;
