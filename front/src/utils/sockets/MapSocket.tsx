import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IPV4, PORT } from "@env";
import { token_storage } from "../../redux/config/storage";

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
    const mapSocketInstance = io(`https://ballorun.com/location`, {
      transports: ["websocket"],
      auth: { token: access_token },
      reconnection: true,              // 기본값이지만 명시적으로
      reconnectionAttempts: Infinity,  // 무한 재시도
      reconnectionDelay: 1000,         // 첫 재시도 1초 후
      reconnectionDelayMax: 5000,      // 최대 5초 간격
      timeout: 20000,                  // 연결 시도 타임아웃 20초
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
