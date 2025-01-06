import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface MenuState {
    items: any[]; // 선택된 메뉴 목록
    price: number; // 총 가격
  }
  
  const initialState: MenuState = {
    items: [],
    price: 0,
  };
  
  export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
      setMenu: (state, action: PayloadAction<{ items: any[]; price: number }>) => {
        state.items = action.payload.items;
        state.price = action.payload.price;
      },
    },
  });
  
  export const { setMenu } = menuSlice.actions;
  
  export const selectMenu = (state: RootState) => state.menu;
  
  export default menuSlice.reducer;
  