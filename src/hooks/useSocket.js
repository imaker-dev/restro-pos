import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerSocketListeners } from "../socket/socketListeners";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { JOIN_STATION } from "../socket/socketEvents";

const STATION = "kitchen";

export const useSocket = () => {
  const dispatch = useDispatch();
  const { logIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!logIn) return;

    const socket = connectSocket();
    registerSocketListeners(socket, dispatch);

    // const joinRooms = () => {
    //   socket.emit(JOIN_KITCHEN, (res) => {
    //     console.log("Kitchen Join:", res?.success ? "OK" : "FAIL");
    //   });
    // };

    const joinRooms = () => {

      // STATION JOIN
      socket.emit(
        JOIN_STATION,
        {
          station: "kitchen",
          outletId: 4,
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
  }, [logIn]); // dispatch removed
};
