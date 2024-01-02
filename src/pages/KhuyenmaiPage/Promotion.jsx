import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { GiRibbon } from 'react-icons/gi'; // Import icon khuyến mãi từ thư viện react-icons
import socket from '../../services/socket';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f2f2f2;
  margin: 0;
  padding: 0;
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

const PromotionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const blinkAnimation = keyframes`
  0% {
    color: #ff0000; // Màu chữ ban đầu
  }
  50% {
    color: #00ff00; // Màu chữ ở giữa
  }
  100% {
    color: #ff0000; // Màu chữ ban đầu
  }
`;

const PromotionItem = styled.li`
  font-size: 18px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center; // Canh giữa dọc
  gap: 10px;

  .ribbon-icon {
    font-size: 24px;
    animation: ${blinkAnimation} 1s infinite;
  }
`;

const Promotion = () => {
  const [newsHistory, setNewsHistory] = useState([]);

  useEffect(() => {
    // Lắng nghe lịch sử tin tức từ server
    socket.on('newsHistory', (history) => {
      setNewsHistory(history);
    });

    // return () => {
    //   // Xóa lắng nghe khi component unmount
    //   socket.off('newsHistory');
    // };
  }, []);

  return (
    <Container>
      <Header>
        <h1>Thông Báo Khuyến Mãi</h1>
      </Header>
      <Main>
        <PromotionList>
          {newsHistory.map((news, index) => (
            <PromotionItem key={index}>
              <GiRibbon className="ribbon-icon" /> {/* Icon khuyến mãi */}
              Thông báo {index + 1} <br />
              {`${news.title}: ${news.content}`}
            </PromotionItem>
          ))}
        </PromotionList>
      </Main>
    </Container>
  );
};

export default Promotion;
