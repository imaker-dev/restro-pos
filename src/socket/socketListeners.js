import {
  itemCancelled,
  itemReady,
  kotCancelled,
  kotPreparing,
  kotReady,
  kotServed,
  newKot,
} from "../redux/slices/kotSlice";
import {
  socketConnected,
  socketDisconnected,
} from "../redux/slices/socketSlice";
import { setKotTab } from "../redux/slices/uiSlice";
import { devError, devLog, devWarn } from "../utils/logger";
import {
  playCancelSound,
  playOrderCreatedSound,
  playSuccessSound,
} from "../utils/sound";
import { showToast } from "../utils/toast";
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

export const registerSocketListeners = (socket, dispatch, getState) => {
  socket.on(SOCKET_CONNECT, () => {
    dispatch(socketConnected());
    devLog("🟢 Socket Connected:", socket.id);
  });

  socket.on(SOCKET_DISCONNECT, () => {
    dispatch(socketDisconnected());
    devLog("🔴 Socket Disconnected");
  });

  socket.on(SOCKET_ERROR, (err) => {
    devError("Socket Error:", err.message);
  });

  socket.on(KOT_UPDATED, (data) => {
    devLog("KOT SOCKET:", data);

    switch (data.type) {
      case KOT_CREATED:
        playOrderCreatedSound();
        dispatch(newKot(data.kot));
        const currentTab = getState().ui.kotTab;

        if (currentTab !== "" && currentTab !== "pending") {
          dispatch(setKotTab("pending"));
        }
        showToast({
          title: "New Order",
          message: `${data?.kot?.kotNumber} • ${data?.kot?.itemCount} items`,
          type: "success",
        });

        break;

      case KOT_ACCEPTED:
        // dispatch(kotAccepted(data.kot));
        break;

      case KOT_PREPARING:
        playSuccessSound();
        dispatch(kotPreparing(data.kot));
        break;

      case KOT_READY:
        playSuccessSound();
        dispatch(kotReady(data.kot));
        break;

      case KOT_ITEM_READY:
        playSuccessSound();
        dispatch(itemReady(data.kot));
        break;

      case KOT_SERVED:
        // playSuccessSound();
        dispatch(kotServed(data.kot));
        break;

      case KOT_CANCELLED:
        playCancelSound();
        dispatch(kotCancelled(data.kot));
        showToast({
          title: "Order Cancelled",
          message: `${data?.kot?.kotNumber} ×${data?.kot?.totalItemCount}`,
          type: "warning",
        });
        break;

      case ITEM_CANCELLED:
        playCancelSound();
        dispatch(itemCancelled(data.kot));
        showToast({
          title: "Item Cancelled",
          // message: `${data?.kot?.cancelled_item?.item_name} ×${data?.kot?.cancelled_item?.quantity}`,
          type: "warning",
        });

        break;

      default:
        devWarn("Unhandled KOT type:", data.type);

        break;
    }
  });
};
