"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";
import { SessionProvider, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setProfile } from "@/redux/reducers/profileReducer";

// Inner component to handle data fetching
const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && session) {
        try {
          const response = await axios.get("/api/profile");
          console.log("User data:", response.data.data);
          dispatch(setProfile(response.data.data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [dispatch, session, status]);

  return <>{children}</>;
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <DataProvider>
          {children}
          <Toaster />
        </DataProvider>
      </Provider>
    </SessionProvider>
  );
};

export default GlobalProvider;
