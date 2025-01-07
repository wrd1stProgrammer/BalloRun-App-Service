import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface MenuState {
    items: any[]; // 선택된 메뉴 목록
    price: number; // 총 가격
    quantitiy: number;
  }
  
  const initialState: MenuState = {
    items: [],
    price: 0,
    quantitiy: 0
  };
  
  export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
      setMenu: (state, action: PayloadAction<{ items: any[]; price: number; quantitiy: number }>) => {
        state.items = action.payload.items;
        state.price = action.payload.price;
        state.quantitiy = action.payload.quantitiy;
      },
      updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const { id, quantity } = action.payload;
        const itemIndex = state.items.findIndex((item) => item._id === id);
      
        if (itemIndex !== -1) {
          // 수량 업데이트
          state.items[itemIndex].quantity = quantity;
      
          // 총 가격 및 총 수량 재계산
          let totalPrice = 0;
          let totalQuantity = 0;
      
          state.items.forEach((item) => {
            const priceNumber =
              typeof item.price === 'string'
                ? parseInt(item.price.replace(/\D/g, ''), 10)
                : item.price;
      
            totalPrice += priceNumber * item.quantity;
            totalQuantity += item.quantity;
          });
      
          state.price = totalPrice;
          state.quantitiy = totalQuantity;
        }
      }
    },
  });
  
  export const { setMenu, updateQuantity } = menuSlice.actions;
  
  export const selectMenu = (state: RootState) => state.menu;
  
  export default menuSlice.reducer;
  