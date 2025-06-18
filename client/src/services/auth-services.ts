import axios from "axios";
import { signIn } from "next-auth/react";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}
export const registerUser = async (formData: RegisterFormData) => {
  try {
    const res = await axios.post("/api/auth/register", formData);
    console.log("Registration successful:", res.data);
    return {status: res.status, data: res.data};
  } catch (error: any) {
    console.log("Registration error:", error?.response?.data?.message || error.message);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      return result;
    } catch (error: any) {
    console.log("Login error:", error?.response?.data?.message || error.message);
    return null;
    }
  }
