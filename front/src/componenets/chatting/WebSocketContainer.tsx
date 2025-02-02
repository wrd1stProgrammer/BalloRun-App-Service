// import React, { createContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { token_storage } from "../../redux/config/storage";
// import { IPV4, PORT } from "@env";

// interface Props {
//   children?: React.ReactNode;
// }

// export const WebSocketContext = createContext<Socket | null>(null);

// const WebSocketContainer = ({ children }: Props) => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const access_token = token_storage.getString("access_token");

//     if (!access_token) {
//       console.warn("[WebSocket] 토큰이 없습니다. 소켓 연결을 하지 않습니다.");
//       return;
//     }

//     const socketInstance = io(`http://${IPV4}:${PORT}`, {
//       transports: ["websocket"],
//       auth: { token: access_token }, // 서버에서 검증하도록 설정
//     });

//     socketInstance.on("connect", () => {
//       console.log("[WebSocket] Connected to server");
//     });

//     socketInstance.on("disconnect", (reason) => {
//       console.warn("[WebSocket] Disconnected:", reason);
//     });

   

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={socket}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export default WebSocketContainer;
