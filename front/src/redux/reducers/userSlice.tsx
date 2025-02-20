import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface UserData {
  [key: string]: any;
  isOngoingOrder?: boolean;
}

interface UserState {
  user: null | UserData;
}

const initialState: UserState = {
  user: {
    isOngoingOrder: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = {
        ...state.user,
        ...action.payload,
        isOngoingOrder: action.payload.isOngoingOrder ?? false,
      };
    },
    setIsOngoingOrder: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOngoingOrder = action.payload;
      }
    },
  },
});

export const { setUser, setIsOngoingOrder } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsOngoingOrder = (state: RootState) => state.user.user?.isOngoingOrder ?? false;

export default userSlice.reducer;