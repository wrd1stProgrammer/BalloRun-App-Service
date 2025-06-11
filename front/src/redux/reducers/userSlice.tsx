// src/redux/reducers/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

// 주문 상태 인터페이스
interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

// 사용자 프로필 + 클라이언트 전용 필드
interface UserData {
  [key: string]: any;
  isOngoingOrder?: boolean;
  address?: string;
  detail?: string;
  postalCode?: string;
  addressType?: string;
  curLat?: number;    
  curLng?: number;  
}

// 슬라이스 상태 인터페이스
interface UserState {
  user: UserData | null;
  ongoingOrder: OrderStatus | null;   // 클라이언트 전용
  isMatching: boolean;                // 클라이언트 전용
  accessToken: string | null;         // ★ 추가
  refreshToken: string | null;        // ★ 추가
}

const initialState: UserState = {
  user: {
    isOngoingOrder: false,
    address: '',
    detail: '',
    postalCode: '',
    addressType: '',
    riderNote: '',
    lat: 0,
    lng: 0,
    curLat: 0,    //
    curLng: 0,    //
  },
  ongoingOrder: null,
  isMatching: false,
  accessToken: null,   // ★ 초기값
  refreshToken: null,  // ★ 초기값
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 프로필 설정
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = {
        ...state.user,
        ...action.payload,
        isOngoingOrder:
          action.payload.isOngoingOrder ??
          state.user?.isOngoingOrder ??
          false,
      };
    },

    // 토큰 저장 ★
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    // 인증 해제(로그아웃) ★
    clearAuth: (state) => {
      state.user = null;
      state.ongoingOrder = null;
      state.isMatching = false;
      state.accessToken = null;
      state.refreshToken = null;
    },

    // 클라이언트 전용: 주문 진행 상태 변경
    setIsOngoingOrder: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOngoingOrder = action.payload;
      }
    },

    // 클라이언트 전용: 진행 중인 주문 저장
    setOngoingOrder: (state, action: PayloadAction<OrderStatus>) => {
      state.ongoingOrder = action.payload;
      state.isMatching = true;
      if (state.user) {
        state.user.isOngoingOrder = true;
      }
    },

    // 주소 설정
    setUserAddress: (
      state,
      action: PayloadAction<{
        address: string;
        detail?: string;
        postalCode?: string;
        addressType?: string;
        riderNote?: string;
        lat?: number;
        lng?: number;
      }>
    ) => {
      if (state.user) {
        Object.assign(state.user, action.payload);
      }
    },

    // 클라이언트 전용: 진행 주문 초기화
    clearOngoingOrder: (state) => {
      state.ongoingOrder = null;
      state.isMatching = false;
      if (state.user) {
        state.user.isOngoingOrder = false;
      }
    },

    // 클라이언트 전용: 매칭 상태 설정
    setIsMatching: (state, action: PayloadAction<boolean>) => {
      state.isMatching = action.payload;
    },
  },
});

export const {
  setUser,
  setTokens,        // ★ export
  clearAuth,        // ★ export
  setUserAddress,
  setIsOngoingOrder,
  setOngoingOrder,
  clearOngoingOrder,
  setIsMatching,
} = userSlice.actions;

// 셀렉터
export const selectUser = (state: RootState) => state.user.user;
export const selectUserAddress = (state: RootState) =>
  state.user.user?.address ?? '';
export const selectIsOngoingOrder = (state: RootState) =>
  state.user.user?.isOngoingOrder ?? false;
export const selectOngoingOrder = (state: RootState) =>
  state.user.ongoingOrder;
export const selectIsMatching = (state: RootState) => state.user.isMatching;
export const selectAccessToken = (state: RootState) =>
  state.user.accessToken;     // ★ 추가
export const selectRefreshToken = (state: RootState) =>
  state.user.refreshToken;    // ★ 추가

export default userSlice.reducer;
