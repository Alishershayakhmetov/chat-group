"use client";
import { useEffect, useState } from "react";
import { App } from "../components/app";
import axios from "axios";
import HelloPage from "../components/helloPage";
import URLS from "../utils/urls";
import { SocketProvider } from "../contexts/socketContext";

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
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // You can render a loading state here if needed
    return <div>Loading...</div>;
    // return <App />;
  }

  if (isAuthenticated) {
    return (
      <SocketProvider>
        <App />
      </SocketProvider>
    );
  }
  return <HelloPage />;
}
