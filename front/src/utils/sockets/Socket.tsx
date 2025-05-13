import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { token_storage } from "../../redux/config/storage";
import { IPV4, PORT } from "@env";

interface Props {
  children?: React.ReactNode;
}

export const WebSocketContext = createContext<Socket | null>(null);

const WebSocketContainer = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const access_token = token_storage.getString("access_token");

    if (!access_token) {
      console.warn("[WebSocket] 토큰이 없습니다. 소켓 연결을 하지 않습니다.");
      return;
    }
    // 소켓을 기능별로 나눠서 io 를 관리하자! -> 좀 나중에
    const socketInstance = io(`https://ballorun.com`, {
      transports: ["websocket"],
      auth: { token: access_token }, // 서버에서 검증하도록 설정
      reconnection: true,              // 기본값이지만 명시적으로
      reconnectionAttempts: Infinity,  // 무한 재시도
      reconnectionDelay: 1000,         // 첫 재시도 1초 후
      reconnectionDelayMax: 5000,      // 최대 5초 간격
      timeout: 20000,                  // 연결 시도 타임아웃 20초
    });

    socketInstance.on("connect", () => {
      console.log("[WebSocket] Connected to server");
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("[WebSocket] Disconnected:", reason);
    });

   

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContainer;
