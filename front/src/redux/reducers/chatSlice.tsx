// src/redux/reducers/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

interface ChatRoomState {
  [roomId: string]: {
    lastChat: string;  // 마지막 메시지 내용
    lastChatAt: string; // 마지막 메시지 시간
    unreadCount: number;
  };
}

const initialState: ChatRoomState = {};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 초기 채팅방 목록 설정
    setChatRooms: (state, action: PayloadAction<{ id: string; lastChat: string; lastChatAt: string; unreadCount: number }[]>) => {
      action.payload.forEach((room) => {
        state[room.id] = {
          lastChat: room.lastChat,
          lastChatAt: room.lastChatAt,
          unreadCount: room.unreadCount
        };
      });
    },
    // 특정 채팅방의 마지막 메시지 업데이트
    updateLastChat: (
      state,
      action: PayloadAction<{ roomId: string; lastChat: string; lastChatAt: string; unreadCount: number }>
    ) => {
      state[action.payload.roomId] = {
        lastChat: action.payload.lastChat,
        lastChatAt: action.payload.lastChatAt,
        unreadCount: action.payload.unreadCount,
      };
    },
  },
});

export const { setChatRooms, updateLastChat } = chatSlice.actions;
export const selectChatRoom = (state: RootState, roomId: string) => state.chat[roomId];
export default chatSlice.reducer;