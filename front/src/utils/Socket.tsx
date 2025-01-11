import React, { createContext, useEffect, useState, useContext, useCallback } from "react";
import { Socket, io } from "socket.io-client";
import { resetAndNavigate } from "../navigation/NavigationUtils";
import { useAppDispatch } from "../redux/config/reduxHook";
import { token_storage } from "../redux/config/storage";
import { IPV4 } from "@env";
import { refresh_tokens } from "../redux/config/apiConfig";

interface Props {
  children?: React.ReactNode;
}

// WebSocketContext 생성
export const WebSocketContext = createContext<Socket | null>(null);

const WebSocketContainer = ({ children }: Props) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);
  const access_token = token_storage.getString("access_token") as string;
  const refresh_token = token_storage.getString("refresh_token") as string;

  const handleTokenExpiry = useCallback(async () => {
    if (refresh_token) {
      const new_access_token = await refresh_tokens();
      if (new_access_token) {
        token_storage.set("access_token", new_access_token); // 새 토큰 저장
        return new_access_token;
      } else {
        resetAndNavigate("LoginScreen");
        return null;
      }
    } else {
      resetAndNavigate("LoginScreen");
      return null;
    }
  }, [refresh_token]);

  useEffect(() => {
    
    if (access_token) {
      const socket = io(`http://${IPV4}:3000`, {
        transports: ["websocket"],
        auth: { token: access_token },
      });

      socket.on("connect_error", async (err) => {
        console.log("에러 connect_error");
        if (err.message === "Authentication error: Token expired") {
          const new_access_token = await handleTokenExpiry();
          if (new_access_token) {
            socket.auth.token = new_access_token;
            socket.connect();
          }
        } else {
          console.error("Socket connection error:", err);
        }
      });

      socket.on("connect", () => {
        console.log("Connected to server 소켓 컨테이네 확인");
      });

      socket.on("error", (object) => {
        const { data, url } = object;
        socket.emit(`${url}`, { ...data, token: access_token });
      });

      setWebSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [access_token, handleTokenExpiry]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContainer;


/*
import { WebSocketContext }... 이걸 가져옴
const socket = useContext(WebSocketContext);

socket.on("orderMatched", (data) => {
  console.log("Order matched:", data);

  // Redux를 사용해 상태 업데이트
  dispatch(updateOrderStatus(data));

  // UI 변경 등 추가 작업
});

--> 이런식으로 emit 한 것을 on 으로 받는 것, 반대로 클라에서 emit 한 걸 서버에서 on으로
받을 수도 있음.

*/