import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Typography } from '@mui/material';  // Corrected import

const ChatModal = ({ show, onHide, cartItems }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Typography variant="body1" gutterBottom style={{ color: '#000', fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}>
          Sawadee kha! Welcome to our restaurant. Would you like to place an order or do you have any questions? Please select the chat option that best suits your needs.
        </Typography>
        <Button variant="primary" className="w-100 mb-2" onClick={() => alert('Voice Chat Selected')} style={{ backgroundColor: '#D5AA55', borderColor: '#D5AA55', color: '#fff', padding: '10px', fontSize: '16px' }}>
          Voice Chat
        </Button>
        <Button variant="secondary" className="w-100" onClick={() => alert('Text Chat Selected')} style={{ backgroundColor: '#fff', borderColor: '#D5AA55', color: '#D5AA55', padding: '10px', fontSize: '16px' }}>
          Text Chat
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;
