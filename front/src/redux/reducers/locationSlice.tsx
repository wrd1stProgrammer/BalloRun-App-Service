import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  watchId: number | null;
}

const initialState: LocationState = {
  watchId: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setWatchId: (state, action: PayloadAction<number | null>) => {
      console.log("🔥 Redux에 watchId 저장됨:", action.payload);
      state.watchId = action.payload;
    },
  },
});

export const { setWatchId } = locationSlice.actions;
export default locationSlice.reducer;