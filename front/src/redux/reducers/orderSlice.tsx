import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface OrderState {
  lat: string;
  lng: string;
  startTime: number;
  endTime: number;
  deliveryType: 'direct' | 'cupHolder';
  deliveryFee: number;
  riderRequest: string;
}

const initialState: OrderState = {
  lat: "",
  lng: "",
  deliveryType: 'direct',
  startTime: 0,
  endTime: 0,
  deliveryFee: 0,
  riderRequest: ""
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<OrderState>) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.deliveryType = action.payload.deliveryType;
      state.deliveryFee = action.payload.deliveryFee;
      state.riderRequest = action.payload.riderRequest
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action: PayloadAction<number>) => {
      state.endTime = action.payload;
    },
    setAddress: (state, action: PayloadAction<{ lat: string; lng: string }>) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
    setDeliveyRequest: (state, action: PayloadAction<string>) => {
      state.riderRequest = action.payload;
    }, 
  },
});

export const { setOrder, setStartTime, setEndTime, setAddress, setDeliveryFee, setDeliveyRequest } = orderSlice.actions;

export const selectOrder = (state: any) => state.order;

export default orderSlice.reducer;
