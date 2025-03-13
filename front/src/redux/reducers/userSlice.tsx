import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

// 주문 상태 인터페이스
interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

interface UserData {
  [key: string]: any;
  isOngoingOrder?: boolean;
  address?: string;
  detail?: string;
  postalCode?: string;
  addressType?: string;
}

interface UserState {
  user: null | UserData;
  ongoingOrder: OrderStatus | null; // 클라이언트에서만 관리
  isMatching: boolean; // 클라이언트에서만 관리
}

const initialState: UserState = {
  user: {
    isOngoingOrder: false,
    address: '',
    detail: '',
    postalCode: '',
    addressType: '',
    riderNote: ''
  },
  ongoingOrder: null,
  isMatching: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = {
        ...state.user, // 기존 user 상태 유지
        ...action.payload, // 서버 데이터 병합
        isOngoingOrder: action.payload.isOngoingOrder ?? state.user?.isOngoingOrder ?? false, // 기존 값 유지
      };
    },
    setIsOngoingOrder: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOngoingOrder = action.payload;
      }
    },
    setOngoingOrder: (state, action: PayloadAction<OrderStatus>) => {
      state.ongoingOrder = action.payload;
      state.isMatching = true;
      if (state.user) {
        state.user.isOngoingOrder = true;
      }
    },
    setUserAddress: (state, action: PayloadAction<{ address: string; detail?: string; postalCode?: string; addressType?: string; riderNote?: string }>) => {  
      if (state.user) {
          state.user.address = action.payload.address;
          state.user.detail = action.payload.detail;
          state.user.postalCode = action.payload.postalCode;
          state.user.addressType = action.payload.addressType;
          state.user.riderNote = action.payload.riderNote;

      }
  },
    clearOngoingOrder: (state) => {
      state.ongoingOrder = null;
      state.isMatching = false;
      if (state.user) {
        state.user.isOngoingOrder = false;
      }
    },
    setIsMatching: (state, action: PayloadAction<boolean>) => {
      state.isMatching = action.payload;
    },
  },
});

export const { setUser, setUserAddress, setIsOngoingOrder, setOngoingOrder, clearOngoingOrder, setIsMatching } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserAddress = (state: RootState) => state.user.user?.address ?? '';  // ✅ 주소 선택자 추가
export const selectIsOngoingOrder = (state: RootState) => state.user.user?.isOngoingOrder ?? false;
export const selectOngoingOrder = (state: RootState) => state.user.ongoingOrder;
export const selectIsMatching = (state: RootState) => state.user.isMatching;

export default userSlice.reducer;