import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type LangsType = keyof typeof import("@uiw/codemirror-extensions-langs").langs;

interface settingsState {
  fontSize: number;
  language: LangsType;
  theme: string;
}

const savedState =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("settingsState")
    : null;
const initialState: settingsState = savedState
  ? JSON.parse(savedState)
  : {
      fontSize: 18,
      theme: "default",
    };

// Function to save the state to localStorage
function saveStateToLocalStorage(state: settingsState) {
  localStorage.setItem("settingsState", JSON.stringify(state));
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeFontSize: (state, action) => {
      console.log("Running", action.payload);
      state.fontSize = action.payload;
      saveStateToLocalStorage(state);
    },
    changeTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
      saveStateToLocalStorage(state);
    },
  },
});

export const { changeFontSize, changeTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
