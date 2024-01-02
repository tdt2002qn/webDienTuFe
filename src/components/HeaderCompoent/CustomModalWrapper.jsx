// CustomModalWrapper.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import CustomModal from './CustomModal';

const modalRoot = document.getElementById('modal-root') || document.createElement('div');
modalRoot.id = 'modal-root';
document.body.appendChild(modalRoot);

const ModalWrapper = ({ showModal, modalMessage, closeModal }) => {
  return ReactDOM.createPortal(
    showModal && <CustomModal message={modalMessage} onClose={closeModal} />,
    modalRoot
  );
};

export default ModalWrapper;
