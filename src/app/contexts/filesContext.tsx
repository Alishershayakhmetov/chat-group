import { createContext, useContext } from "react";
import React from "react";
import { useFiles } from "../hooks/useFiles";

type FilesReturnType = ReturnType<typeof useFiles>;

const FilesContext = createContext<FilesReturnType | null>(null);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const files = useFiles();
  return (
    <FilesContext.Provider value={files}>{children}</FilesContext.Provider>
  );
};

export const useFilesContext = () => {
  const files = useContext(FilesContext);
  if (!files) {
    throw new Error(
      "useChatSocketContext must be used within a ChatSocketProvider"
    );
  }
  return files;
};
