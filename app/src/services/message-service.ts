import axios from "axios";

export const getMessages = async (roomId: string) => {
  try {
    const { status, data } = await axios.get(`/api/messages/${roomId}`);
    return { data, status };
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// create message
export const createMessage = async (roomId: string, message: string) => {
  try {
    const { status, data } = await axios.post(`/api/messages/${roomId}`, {
      message,
    });
    return { data, status };
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};
