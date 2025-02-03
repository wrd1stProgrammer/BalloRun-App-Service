import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { token_storage } from "../redux/config/storage";
import { IPV4, PORT } from "@env";

interface Props {
  children?: React.ReactNode;
}

export const MapSocketContext = createContext<Socket | null>(null);

const MapSocketContainer = ({ children }: Props) => {
  const [mapSocket, setMapSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const access_token = token_storage.getString("access_token");

    if (!access_token) {
      console.warn("[Map WebSocket] 토큰이 없습니다.");
      return;
    }

    // 위치 정보용 소켓 (`/location` 네임스페이스 사용)
    const mapSocketInstance = io(`http://${IPV4}:${PORT}/location`, {
      transports: ["websocket"],
      auth: { token: access_token },
    });

    mapSocketInstance.on("connect", () => {
      console.log("[Map WebSocket] Connected!");
    });

    mapSocketInstance.on("disconnect", (reason) => {
      console.warn("[Map WebSocket] Disconnected:", reason);
    });

    setMapSocket(mapSocketInstance);

    return () => {
      mapSocketInstance.disconnect();
    };
  }, []);

  return (
    <MapSocketContext.Provider value={mapSocket}>
      {children}
    </MapSocketContext.Provider>
  );
};

export default MapSocketContainer;
