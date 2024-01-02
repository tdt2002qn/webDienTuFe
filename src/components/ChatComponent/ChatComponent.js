// ChatComponent.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import socket from '../../services/socket';
import { useSelector } from 'react-redux';

// Styled components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 700px;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
`;

const Message = styled.div`
  padding: 10px;
  margin: 5px;
  background-color: ${props => props.sender === 'user' ? '#f2f2f2' : '#e6f7ff'};
  border-radius: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const InputBox = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ChatComponent = () => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });
  }, []);
  const senderName = user?.name || user?.email;
  const sendMessage = () => {
    socket.emit('chat message', { text: input, sender: senderName });
    setInput('');
  };

  return (
    <ChatContainer>
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender}>
          <strong>{msg.sender}:</strong> {msg.text}
        </Message>
      ))}
      <InputContainer>
        <InputBox
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
        />
        <SendButton onClick={sendMessage}>
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatComponent;