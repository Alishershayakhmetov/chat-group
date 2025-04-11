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
import LoadingPage from "../components/public/loading";
import { MobileProvider } from "../contexts/mobileContext";
import { ChatSearchProvider } from "../contexts/chatSearchContext";
import { DarkModeProvider } from "../contexts/darkModeContext";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(URLS.checkAuth, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data ? false : true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return (
      <SocketProvider>
        <ChatFormProvider>
          <ChatSocketProvider>
            <FilesProvider>
              <MobileProvider>
                <ChatSearchProvider>
                  <DarkModeProvider>
                    <App />
                  </DarkModeProvider>
                </ChatSearchProvider>
              </MobileProvider>
            </FilesProvider>
          </ChatSocketProvider>
        </ChatFormProvider>
      </SocketProvider>
    );
  }
  return <HelloPage />;
}
