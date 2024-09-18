// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import settingsReducer from "./reducers/settingsReducer";
import filesReducer from "./reducers/filesReducer";
import userReducer from "./reducers/userReducer";
import roomReducer from "./reducers/roomReducer";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    files: filesReducer,

    user: userReducer,
    room: roomReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
