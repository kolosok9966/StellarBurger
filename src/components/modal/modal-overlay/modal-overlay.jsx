import PropTypes from 'prop-types';

import styles from './modal-overlay.module.css';

const ModalOverlay = ({ handleClose }) => {
  ModalOverlay.propTypes = {
    handleClose: PropTypes.func.isRequired,
  };

  return <div className={styles.overlay} onClick={handleClose} />;
};

export default ModalOverlay;
