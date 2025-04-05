"use client";
import { useEffect, useState } from "react";
import { App } from "../components/app";
import axios from "axios";
import HelloPage from "../components/public/helloPage";
import URLS from "../utils/urls";
import { SocketProvider } from "../contexts/socketContext";
import { ChatFormProvider } from "../contexts/chatFormContext";
import { ChatSocketProvider } from "../contexts/chatSocketContext";
import { FilesProvider } from "../contexts/filesContext";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(URLS.chechAuth, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data ? false : true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // You can render a loading state here if needed
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <SocketProvider>
        <ChatFormProvider>
          <ChatSocketProvider>
            <FilesProvider>
              <App />
            </FilesProvider>
          </ChatSocketProvider>
        </ChatFormProvider>
      </SocketProvider>
    );
  }
  return <HelloPage />;
}
