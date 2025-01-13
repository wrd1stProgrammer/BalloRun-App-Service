import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface OrderState {
    lat: string,
    lng: string,
    startTime: Number, // any?
    endTime:Number,
    deliveryType: 'direct' | 'cupHolder' 
    deliveryFee: Number
}

const initialState: OrderState = {
    lat: "",
    lng: "",
    deliveryType: 'direct',
    startTime: 0,
    endTime: 0,
    deliveryFee: 0
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<object>) => {

    },
  },
});

export const {setOrder} = orderSlice.actions;

export const selectOrder = (state: RootState) => state.order;

export default orderSlice.reducer;