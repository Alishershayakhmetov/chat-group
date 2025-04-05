import { useState } from "react";

export const useFiles = () => {
  const [files, setFiles] = useState<{ file: File; saveAsMedia: boolean }[]>([]);
  const [showFileWindow, setShowFileWindow] = useState(false);

	const handleCloseWindow = () => {
    setFiles([]);
    setShowFileWindow(false);
  };

	const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    saveAsMedia = true
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles).map((file) => ({
        file,
        saveAsMedia,
      }));

      if (files.length + fileArray.length > 10) {
        alert("You can only attach up to 10 files.");
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
      setShowFileWindow(true);
    }
  };

	const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

	const handleFileTypeChange = (index: number) => {
    setFiles(
      files.map((file, ind) => {
        if (ind === index) {
          return { ...file, saveAsMedia: !file.saveAsMedia };
        }
        return file;
      })
    );
  };

	const handleFileEmpty = () => {
		setFiles([]);
	}

	return {files, showFileWindow, handleCloseWindow, handleFileChange, handleFileTypeChange, handleRemoveFile, handleFileEmpty};
}