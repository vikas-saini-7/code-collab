import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface filesState {
  value: string;
}

const initialState = {
  value: "",
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    changeCode: (state, action) => {
      console.log("Running", action.payload);
    },
  },
});

export const { changeCode } = filesSlice.actions;
export default filesSlice.reducer;
