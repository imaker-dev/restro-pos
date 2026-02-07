import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { isSocketConnected } from "../../socket/socket";

const SocketBadge = () => {
      const connected = isSocketConnected();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
        ${connected
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
        }`}
    >
      {connected ? (
        <Wifi size={14} />
      ) : (
        <WifiOff size={14} />
      )}
      <span>{connected ? "Online" : "Offline"}</span>
    </div>
  );
};

export default SocketBadge;
