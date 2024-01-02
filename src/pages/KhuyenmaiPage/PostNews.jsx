import React, { useState } from 'react';
import styled from 'styled-components';
import socket from '../../services/socket';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f2f2f2;
  margin: 0;
  padding: 0;
  height: 1000px;
`;

const Header = styled.header`
  background-color: #4caf50;
  color: white;
  text-align: center;
  padding: 10px;
`;

const Main = styled.main`
  max-width: 800px;
  margin: 20px auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  margin: auto;
`;

const PostNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi dữ liệu tới server thông qua Socket.IO
    socket.emit('postNews', { title, content });

    // Làm bất kỳ xử lý nào khác sau khi gửi tin tức

    // Xóa nội dung trường sau khi đăng tin
    setTitle('');
    setContent('');
  };

  return (
    <Container>
      <Header>
        <h1>Đăng Tin</h1>
      </Header>
      <Main>
        <Form onSubmit={handleSubmit}>
          <label htmlFor="title">Tiêu đề:</label>
          <Input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="content">Nội dung:</label>
          <TextArea
            id="content"
            name="content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></TextArea>

          <Button type="submit">Đăng Tin</Button>
        </Form>
      </Main>
    </Container>
  );
};

export default PostNews;
