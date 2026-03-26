import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  // console.log('TOKEN :' + token);
  if (!socket) {
    socket = io('http://localhost:8001', {
      auth: { token },
    });
  }
  return socket;
};

export const getSocket = () => socket;
