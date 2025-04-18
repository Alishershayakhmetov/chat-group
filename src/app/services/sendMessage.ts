"use client"
import axios from "axios";
import { useSocketContext } from "../contexts/socketContext";
import { generateBase64Blur } from "../utils/base64blur";
import { useAddTempMessage } from "../utils/tempMessage";
import { useChatFormContext } from "../contexts/chatFormContext";
import { useFilesContext } from "../contexts/filesContext";

export const useSendMessage = () => {
  const { socket } = useSocketContext();
  const {
    messageText,
    isMessageEdit,
    targetMessageId,
    isMessageReply,
    handleSetIsMessageEditFalse,
    handleSetTargetMessageIdUndefined,
    handleSetMessageTextEmpty,
  } = useChatFormContext();
  const { files, handleFileEmpty } = useFilesContext();
  const handleAddTempMessage = useAddTempMessage();

  const handleSendMessage = async (roomId: string) => {
    if (shouldAbortSend()) return;
    if (handleMessageEdit()) return;

    try {
      const { tempId, attachments } = prepareTempMessage();
      const { blurHashes, extensions } = await processFiles();
      console.log(extensions);
      let urls;
      if (extensions.length !== 0) {
        urls = await getUploadUrls(extensions);
        await uploadFiles(urls);
      }
      sendCompleteMessage(roomId, tempId, urls, blurHashes);
      resetForm();
    } catch (error) {
      handleSendError(error);
    }
  };

  // Helper functions
  const shouldAbortSend = () => {
    if (!messageText.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return true;
    }
    return false;
  };

  const handleMessageEdit = () => {
    if (isMessageEdit && targetMessageId) {
      socket.emit("editMessage", {
        messageId: targetMessageId,
        editedText: messageText,
      });
      resetEditState();
      return true;
    }
    return false;
  };

  const resetEditState = () => {
    handleSetIsMessageEditFalse();
    handleSetTargetMessageIdUndefined();
    handleSetMessageTextEmpty();
  };

  const prepareTempMessage = () => {
    const text = messageText.trim();
    const attachments = files.map((file) => ({
      fileName: file.file.name,
      saveAsMedia: file.saveAsMedia,
      fileURL: URL.createObjectURL(file.file),
      fileSize: file.file.size,
    }));
    const tempId = handleAddTempMessage({ text, attachments });
    return { tempId, attachments };
  };

  const processFiles = async () => {
    const extensions = files.map((file) => file.file.name.split(".").pop() || "");
    
    const blurHashPromises = files.map((file) => 
      file.file.type.startsWith("image/") && !file.saveAsMedia 
        ? generateBase64Blur(file.file) 
        : Promise.resolve("")
    );
    
    const blurHashes = await Promise.all(blurHashPromises);
    return { blurHashes, extensions };
  };

  const getUploadUrls = (extensions: string[]) => {
    return new Promise<{ url: string; key: string }[]>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Upload request timed out"));
      }, 10000);

      socket.emit("upload", { extensions }, (response: any) => {
        clearTimeout(timeout);
        
        if (response?.error) {
          reject(new Error(response.error));
        } else if (response?.urls) {
          resolve(response.urls);
        } else {
          reject(new Error("Invalid response format from server"));
        }
      });
    });
  };

  const uploadFiles = async (urls: { url: string }[]) => {
    const uploadPromises = files.map((file, index) => 
      axios.put(urls[index].url, file.file, {
        headers: { "Content-Type": file.file.type },
      })
    );
    await Promise.all(uploadPromises);
  };

  const sendCompleteMessage = (
    roomId: string,
    tempId: string,
    urls: { url: string; key: string }[] | undefined,
    blurHashes: string[]
  ) => {
    const uploadedFiles = urls && urls.map((url, index) => ({
      key: url.key,
      name: files[index].file.name,
      url: url.url.split("?")[0],
      saveAsMedia: files[index].saveAsMedia,
      fileSize: files[index].file.size,
      fileBase64Blur: blurHashes[index],
    }));

    const payload = {
      roomId,
      text: messageText.trim(),
      attachments: uploadedFiles,
      tempId,
      originalMessageId: isMessageReply ? targetMessageId : null,
    };

    socket.emit("sendMessage", payload);
  };

  const resetForm = () => {
    handleSetMessageTextEmpty();
    handleFileEmpty();
  };

  const handleSendError = (error: unknown) => {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  };

  return handleSendMessage;
};
