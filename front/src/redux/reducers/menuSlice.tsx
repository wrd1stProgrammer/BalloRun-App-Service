import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface MenuItem {
  _id: string;
  menuName: string;
  price: number;
  quantity: number;
  RequiredOption: string | null; // 필수 옵션
  AdditionalOptions: string[]; // 추가 옵션
}

interface MenuState {
  items: MenuItem[]; // 선택된 메뉴 목록
  price: number; // 총 가격
  quantitiy: number; // 총 수량
}

const initialState: MenuState = {
  items: [],
  price: 0,
  quantitiy: 0,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (
      state,
      action: PayloadAction<{
        items: MenuItem[];
        price: number;
        quantitiy: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.price = action.payload.price;
      state.quantitiy = action.payload.quantitiy;
    },
    removeItem: (state, action: PayloadAction<{ id: string; requiredOption: string | null; additionalOptions: string[] }>) => {
      const { id, requiredOption, additionalOptions } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item._id === id &&
            item.RequiredOption === requiredOption &&
            JSON.stringify(item.AdditionalOptions) === JSON.stringify(additionalOptions))
      );

      // 총 가격 및 총 수량 재계산
      let totalPrice = 0;
      let totalQuantity = 0;

      state.items.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
      });

      state.price = totalPrice;
      state.quantitiy = totalQuantity;
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number; requiredOption: string | null; additionalOptions: string[] }>) => {
      const { id, quantity, requiredOption, additionalOptions } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) =>
          item._id === id &&
          item.RequiredOption === requiredOption &&
          JSON.stringify(item.AdditionalOptions) === JSON.stringify(additionalOptions)
      );

      if (itemIndex !== -1) {
        // 수량 업데이트
        state.items[itemIndex].quantity = quantity;

        // 총 가격 및 총 수량 재계산
        let totalPrice = 0;
        let totalQuantity = 0;

        state.items.forEach((item) => {
          totalPrice += item.price * item.quantity;
          totalQuantity += item.quantity;
        });

        state.price = totalPrice;
        state.quantitiy = totalQuantity;
      }
    },
    clearMenu: (state) => {
      state.items = [];
      state.price = 0;
      state.quantitiy = 0;
    },
  },
});

export const { setMenu, updateQuantity, removeItem, clearMenu  } = menuSlice.actions;
export const selectMenu = (state: RootState) => state.menu;
export default menuSlice.reducer;
