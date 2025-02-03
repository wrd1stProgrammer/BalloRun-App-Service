import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { token_storage } from "../../redux/config/storage";
import { IPV4, PORT } from "@env";

interface Props {
  children?: React.ReactNode;
}

export const ChatSocketContext = createContext<Socket | null>(null);

const ChatSocketContainer = ({ children }: Props) => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const access_token = token_storage.getString("access_token");

    if (!access_token) {
      console.warn("[Chat WebSocket] 토큰이 없습니다.");
      return;
    }

    // 채팅용 소켓 (`/chat` 네임스페이스 사용)
    const chatSocketInstance = io(`http://${IPV4}:${PORT}/chat`, {
      transports: ["websocket"],
      auth: { token: access_token },
    });

    chatSocketInstance.on("connect", () => {
      console.log("[Chat WebSocket] Connected!");
    });

    chatSocketInstance.on("disconnect", (reason) => {
      console.warn("[Chat WebSocket] Disconnected:", reason);
    });

    setChatSocket(chatSocketInstance);

    return () => {
      chatSocketInstance.disconnect();
    };
  }, []);

  return (
    <ChatSocketContext.Provider value={chatSocket}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export default ChatSocketContainer;
