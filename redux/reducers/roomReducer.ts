import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMessage {
  username: string;
  message: string;
}

interface RoomState {
  roomId: string;
  activeUsers: string[];
  messages: IMessage[];
}

const initialState: RoomState = {
  roomId: "",
  activeUsers: [],
  messages: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setRoomId, setActiveUsers, setMessages } = roomSlice.actions;
export default roomSlice.reducer;
