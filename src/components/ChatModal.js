import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import '../App.css'; // Ensure your CSS file is imported

const ChatModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setError(null);
    setIsTyping(true);  // Show typing indicator

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
    } finally {
      setIsTyping(false);  // Hide typing indicator after response
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages, displayedMessage]);

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

  return (
    <Modal show={show} onHide={onHide} dialogClassName={show ? 'modal-pulse' : ''}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Typography
          variant="body1"
          gutterBottom
          className="chat-welcome-text"
        >
          Sawadee kha! Welcome to Qulture Lounge & Cafe. <br></br> You are chatting with an AI Digital Server. <br></br>
        </Typography>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'user-message' : 'assistant-message'}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}: </strong>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
          {currentAssistantMessage && (
            <div className="assistant-message">
              <strong>Assistant: </strong>
              <ReactMarkdown>{displayedMessage}</ReactMarkdown>
            </div>
          )}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here"
          className="chat-input"
        />
        <Button
          variant="primary"
          className="w-100 chat-send-button"
          onClick={sendMessage}
        >
          Send
        </Button>
        <Typography
          variant="body1"
          gutterBottom
          className="chat-disclaimer-text"
        >
          <br></br>AI server can make mistakes. <br></br>Please check important information.
        </Typography>
      </Modal.Body>
    </Modal>
  );
};

const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
    <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
    <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

export default ChatModal;
