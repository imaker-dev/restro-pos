import { io } from "socket.io-client";
import { TOKEN_KEYS } from "../constants";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);

  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
