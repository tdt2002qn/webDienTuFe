// CustomModalSU.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
const ModalWrapper = styled.div`
 
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px; /* Increase padding for a larger modal */
  background-color: #99FFFF; /* Change background color to a vibrant blue */
  border: 1px solid #2980b9; /* Adjust border properties */
  border-radius: 10px; /* Add border-radius for rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add box-shadow for depth */

  p {
    color: #FF3333; /* Set text color to white */
    font-size: 18px; /* Adjust font size */
    font-weight: bold; /* Make text bold */
    margin-bottom: 20px; /* Add margin below the text */
  }

  button {
    background-color: #2ecc71; /* Change button background color to green */
    color: #fff; /* Set button text color to white */
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
  }
`;
const CustomModal = ({ message, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    // Adjust the duration as needed

    return () => clearTimeout(timeoutId); // Clean up the timeout when the component unmounts
  }, [onClose]);

  return (
    <ModalWrapper>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </ModalWrapper>
  );
};


export default CustomModal;
