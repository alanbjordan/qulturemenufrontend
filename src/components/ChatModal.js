import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Typography } from '@mui/material';
import '../App.css'; // Make sure to import your CSS file

const ChatModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setError(null);

    try {
      const response = await fetch('https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages([...messages, newMessage, assistantMessage]);
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const messageStyle = {
    padding: '10px',
    borderRadius: '10px',
    margin: '10px 0',
    maxWidth: '80%',
  };

  const userMessageStyle = {
    ...messageStyle,
    backgroundColor: '#D5AA55', // Gold color for user messages
    color: '#000', // Black text
    alignSelf: 'flex-end',
    textAlign: 'right',
  };

  const assistantMessageStyle = {
    ...messageStyle,
    backgroundColor: '#333', // Dark grey color for assistant messages
    color: '#D5AA55', // Gold text
    alignSelf: 'flex-start',
    textAlign: 'left',
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName={show ? 'modal-pulse' : ''}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Typography
          variant="body1"
          gutterBottom
          style={{ color: '#000', fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}
        >
          Sawadee kha! Welcome to Qulture Lounge & Cafe. <br></br> You are chatting with our AI Digital Server. <br />It can make mistakes please check important info.
        </Typography>
        {error && <Alert variant="danger">{error}</Alert>}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.role === 'user' ? userMessageStyle : assistantMessageStyle}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}: </strong>
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
        />
        <Button
          variant="primary"
          className="w-100"
          onClick={sendMessage}
          style={{ backgroundColor: '#D5AA55', borderColor: '#D5AA55', color: '#fff', padding: '10px', fontSize: '16px' }}
        >
          Send
        </Button>
        <Typography
          variant="body1"
          gutterBottom
          style={{ color: '#000', fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}
        >
          <br></br>Type "done" when finish chatting with your server.
        </Typography>
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;
