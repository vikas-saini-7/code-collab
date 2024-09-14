import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type LangsType = keyof typeof import("@uiw/codemirror-extensions-langs").langs;

interface settingsState {
  fontSize: number;
  language: LangsType;
  theme: string;
}

const initialState: settingsState = {
  fontSize: 18,
  language: "javascript",
  theme: "theme-name",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changeFontSize: (state, action) => {
      console.log("Running", action.payload);
      state.fontSize = action.payload;
    },
    changeLanguage(state, action: PayloadAction<LangsType>) {
      state.language = action.payload;
    },
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { changeFontSize, changeLanguage } = counterSlice.actions;
export default counterSlice.reducer;
