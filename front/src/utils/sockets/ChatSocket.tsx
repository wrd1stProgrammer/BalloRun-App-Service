// src/utils/sockets/ChatSocket.tsx
import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../redux/config/reduxHook";
import { selectAccessToken } from "../../redux/reducers/userSlice";

interface Props {
  children?: React.ReactNode;
}

export const ChatSocketContext = createContext<Socket | null>(null);

const ChatSocketContainer = ({ children }: Props) => {
  const accessToken = useAppSelector(selectAccessToken);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 토큰이 설정되지 않았으면 연결 안 함
    if (!accessToken) {
      // 기존 연결이 있다면 끊어주고
      if (chatSocket) {
        chatSocket.disconnect();
        setChatSocket(null);
      }
      return;
    }

    // 이미 연결된 소켓이 있으면 재사용
    if (chatSocket && chatSocket.connected) return;

    // 토큰이 들어오면 새로 연결
    const socket = io("https://ballorun.com/chat", {
      transports: ["websocket"],
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("[Chat WebSocket] Connected!");
    });
    socket.on("disconnect", (reason) => {
      console.warn("[Chat WebSocket] Disconnected:", reason);
    });

    setChatSocket(socket);

    return () => {
      socket.disconnect();
      setChatSocket(null);
    };
  }, [accessToken]);

  return (
    <ChatSocketContext.Provider value={chatSocket}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export default ChatSocketContainer;
