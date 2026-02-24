import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerSocketListeners } from "../socket/socketListeners";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { JOIN_STATION } from "../socket/socketEvents";
import store from "../store";
import { ROLES } from "../constants";

export const useSocket = () => {
  const dispatch = useDispatch();
  const { logIn, meData, outletId } = useSelector((state) => state.auth);
  const { assignedStations } = meData || {};

  useEffect(() => {
    if (!logIn || !outletId || !assignedStations) return;

    const socket = connectSocket();
    registerSocketListeners(socket, dispatch, store.getState);

    const joinRooms = () => {
      // STATION JOIN
      socket.emit(
        JOIN_STATION,
        {
          outletId: outletId,
          station: assignedStations?.stationId || assignedStations?.stationType,
        },
        (res) => {
          console.log("Station Join:", res?.success ? "OK" : "FAIL");
        },
      );
    };

    // CASE 1: already connected
    if (socket.connected) {
      joinRooms();
    }

    // CASE 2: wait for connection
    socket.on("connect", joinRooms);

    return () => {
      socket.off("connect", joinRooms); // IMPORTANT
      disconnectSocket();
    };
  }, [logIn, outletId, assignedStations]);
};
