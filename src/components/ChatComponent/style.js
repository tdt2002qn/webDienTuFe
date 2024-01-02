import styled from 'styled-components';
// Styled components
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 8000px;
  center: center;
  width: 500px;
  border: 1px solid #ccc;
  margin: 20px;
  overflow-y: scroll;
`;

export const Message = styled.div`
  padding: 10px;
  margin: 5px;
  background-color: ${props => props.sender === 'user' ? '#f2f2f2' : '#e6f7ff'};
  border-radius: 8px;
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

export const InputBox = styled.input`
  flex: 1;
  padding: 8px;
`;

export const SendButton = styled.button`
  margin-left: 10px;
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;