import React, { createContext, useEffect, useState, useContext, useCallback } from "react";
import { Socket, io } from "socket.io-client";
import { resetAndNavigate } from "../navigation/NavigationUtils";
import { useAppDispatch } from "../redux/config/reduxHook";
import { token_storage } from "../redux/config/storage";
import { IPV4 } from "@env";
import { refresh_tokens } from "../redux/config/apiConfig";
import { jwtDecode } from "jwt-decode";

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
      try {
        // refresh_token 디코딩하여 만료 시간 확인
        const decodedToken: { exp: number } = jwtDecode(refresh_token); // 토큰 디코딩
        const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
  
        if (decodedToken.exp < currentTime) {
          console.log("Refresh token 만료됨, 재로그인 필요");
          resetAndNavigate("LoginScreen");
          return null;
        }
  
        console.log("Refresh token 유효, 새로운 access token 요청");
        const new_access_token = await refresh_tokens();
  
        if (new_access_token) {
          token_storage.set("access_token", new_access_token); // 새 토큰 저장
          return new_access_token;
        } else {
          resetAndNavigate("LoginScreen");
          return null;
        }
      } catch (err) {
        console.error("Refresh token 검증 중 오류 발생:", err);
        resetAndNavigate("LoginScreen");
        return null;
      }
    } else {
      console.log("Refresh token 없음");
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
        console.log("WebSocket connect_error:", err.message);
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
        console.log("WebSocket connected!");
      });
  
      socket.on("disconnect", (reason) => {
        console.warn("WebSocket disconnected:", reason);
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