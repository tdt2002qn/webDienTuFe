
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;