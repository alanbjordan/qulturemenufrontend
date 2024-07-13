import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import '../App.css'; // Make sure to import your CSS file

const ChatModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
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
        body: JSON.stringify({ message: input, thread_id: threadId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCurrentAssistantMessage(data.response);
      if (!threadId) {
        setThreadId(data.thread_id);
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (show) {
      const greetingMessage = { role: 'assistant', content: 'Hello, would you like to order?' };
      setMessages([greetingMessage]);
    }
  }, [show]);

  useEffect(() => {
    if (currentAssistantMessage) {
      let index = 0;
      setDisplayedMessage(currentAssistantMessage[0] || ''); // Display the first letter immediately
      const intervalId = setInterval(() => {
        index++;
        if (index < currentAssistantMessage.length) {
          setDisplayedMessage((prev) => prev + currentAssistantMessage[index]);
        } else {
          clearInterval(intervalId);
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: currentAssistantMessage },
          ]);
          setCurrentAssistantMessage('');
          setDisplayedMessage('');
        }
      }, 37.5); // Adjusted typing speed (50ms * 0.75 = 37.5ms)
      return () => clearInterval(intervalId);
    }
  }, [currentAssistantMessage]);

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
          Sawadee kha! Welcome to Qulture Lounge & Cafe. <br></br> You are chatting with an AI Digital Server. <br></br>
        </Typography>
        {error && <Alert variant="danger">{error}</Alert>}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.role === 'user' ? userMessageStyle : assistantMessageStyle}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}: </strong>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
          {currentAssistantMessage && (
            <div style={assistantMessageStyle}>
              <strong>Assistant: </strong>
              <ReactMarkdown>{displayedMessage}</ReactMarkdown>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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
          <br></br>AI server can make mistakes. <br></br>Please check important information.
        </Typography>
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;
