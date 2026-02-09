import { getSocket } from "./socket";
import { KOT_STATUS_UPDATE } from "./socketEvents";

export const emitKotStatusUpdate = ({ orderId, status }) => {
  const socket = getSocket();

  if (!socket || !socket.connected) {
    return Promise.resolve({ success: false });
  }

  return new Promise((resolve) => {
    socket.emit(
      KOT_STATUS_UPDATE,
      { orderId, status },
      (ack) => {
        resolve(ack);
      }
    );
  });
};
