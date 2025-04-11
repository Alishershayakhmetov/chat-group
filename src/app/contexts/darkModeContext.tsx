import { createContext, useContext } from "react";
import React from "react";
import useDarkMode from "../hooks/useDarkMode";

type DarkModeReturnType = ReturnType<typeof useDarkMode>;

const DarkModeContext = createContext<DarkModeReturnType | null>(null);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const darkMode = useDarkMode();
  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => {
  const darkMode = useContext(DarkModeContext);
  if (!darkMode) {
    throw new Error(
      "useDarkModeContext must be used within a DarkModeProvider"
    );
  }
  return darkMode;
};
