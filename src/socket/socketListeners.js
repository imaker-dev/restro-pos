import { newKot } from "../redux/slices/kotSlice";
import { playOrderCreatedSound } from "../utils/sound";
import {
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_ERROR,
  KOT_UPDATED,
  KOT_CREATED,
  KOT_ACCEPTED,
  KOT_PREPARING,
  KOT_ITEM_READY,
  KOT_READY,
  KOT_SERVED,
  ITEM_CANCELLED,
  KOT_CANCELLED,
} from "./socketEvents";

export const registerSocketListeners = (socket, dispatch) => {
  socket.on(SOCKET_CONNECT, () => {
    console.log("🟢 Socket Connected");
  });

  socket.on(SOCKET_DISCONNECT, () => {
    console.log("🔴 Socket Disconnected");
  });

  socket.on(SOCKET_ERROR, (err) => {
    console.error("Socket Error:", err.message);
  });

  socket.on(KOT_UPDATED, (data) => {
    console.log("KOT SOCKET:", data);

    switch (data.type) {
      case KOT_CREATED:
        playOrderCreatedSound();
        dispatch(newKot(data.kot));
        break;

      case KOT_ACCEPTED:
        // dispatch(kotAccepted(data.kot));
        break;

      case KOT_PREPARING:
        // dispatch(kotPreparing(data.kot));
        break;

      case KOT_READY:
        // dispatch(kotReady(data.kot));
        break;

      case KOT_SERVED:
        // dispatch(kotServed(data.kot));
        break;

      case KOT_CANCELLED:
        // dispatch(kotCancelled(data.kot));
        break;

      case ITEM_CANCELLED:
        // dispatch(itemCancelled(data.kot));
        break;

      default:
        console.warn("Unhandled KOT type:", data.type);
        break;
    }
  });
};
