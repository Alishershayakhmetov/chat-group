import { createContext, useContext, useState } from "react";
import React from "react";

interface MobileContextType {
  isMobile: boolean;
  handleSetIsMobile: (value: boolean) => void;
  showRightSlide: boolean;
  handleSetShowRightSlide: (value: boolean) => void;
}

const MobileContext = createContext<MobileContextType | null>(null);

export const MobileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 812);
  const [showRightSlide, setShowRightSlide] = useState(false);

  const handleSetIsMobile = (value: boolean) => {
    setIsMobile(value);
  };

  const handleSetShowRightSlide = (value: boolean) => {
    setShowRightSlide(value);
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        handleSetIsMobile,
        showRightSlide,
        handleSetShowRightSlide,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileContext = () => {
  const mobile = useContext(MobileContext);
  if (!mobile) {
    throw new Error("useMobileContext must be used within a MobileProvider");
  }
  return mobile;
};
