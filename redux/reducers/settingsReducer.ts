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
      language: "javascript",
      theme: "theme-name",
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
    changeLanguage(state, action: PayloadAction<LangsType>) {
      state.language = action.payload;
      saveStateToLocalStorage(state);
    },
  },
});

export const { changeFontSize, changeLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
