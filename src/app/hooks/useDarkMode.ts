'use client'
import { useState } from "react";

export default function useDarkMode (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("isDarkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

	return [isDarkMode, setIsDarkMode]
}