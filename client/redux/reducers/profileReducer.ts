import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  username: string;
  bio: string;
  createdAt: string;
  email: string;
  fullName: string;
  isOnboarded: boolean;
  profilePicture: string;
  role: string;
  updatedAt: string;
  _id: string;
  __v: number;
}

const initialState: ProfileState = {
  username: "",
  bio: "",
  createdAt: "",
  email: "",
  fullName: "",
  isOnboarded: false,
  profilePicture: "",
  role: "",
  updatedAt: "",
  _id: "",
  __v: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    clearProfile: () => {
      return initialState;
    },
  },
});

export const { setUsername, setProfile, updateProfile, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;