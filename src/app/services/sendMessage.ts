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
    if (!messageText.trim() && files.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    const text = messageText.trim();

    if (isMessageEdit && targetMessageId) {
      socket.emit("editMessage", {
        messageId: targetMessageId,
        editedText: messageText,
      });
      handleSetIsMessageEditFalse();
      handleSetTargetMessageIdUndefined();
      handleSetMessageTextEmpty();
      return;
    }

    const attachments = files.map((file) => ({
      fileName: file.file.name,
      saveAsMedia: file.saveAsMedia,
      fileURL: URL.createObjectURL(file.file),
      fileSize: file.file.size,
    }));
    const tempId = handleAddTempMessage({ text, attachments });

    try {
      const extensions = files.map((file) => {
        const parts = file.file.name.split(".");
        return parts.length > 1 ? parts.pop() : "";
      });

      const blurHashPromises = files.map((file, index) => {
        const isImage = file.file.type.startsWith("image/");
        if (isImage && !file.saveAsMedia) {
          return generateBase64Blur(file.file);
        }
        return Promise.resolve("");
      });
      const blurHashes = await Promise.all(blurHashPromises);

      const result = await axios.post("http://localhost:3005/upload", {
        extensions,
      });

      const urls: { url: string; key: string }[] = result.data.urls;

      const uploadPromises = files.map((file, index) => {
        const fileUrl = urls[index].url;
        return axios.put(fileUrl, file.file, {
          headers: {
            "Content-Type": file.file.type,
          },
        });
      });

      await Promise.all(uploadPromises);

      const uploadedFiles = urls.map(
        (url: { url: string; key: string }, index: number) => ({
          key: url.key,
          name: files[index].file.name,
          url: url.url.split("?")[0],
          saveAsMedia: files[index].saveAsMedia,
          fileSize: files[index].file.size,
          fileBase64Blur: blurHashes[index],
        })
      );

      const payload = {
        roomId,
        text: messageText.trim(),
        attachments: uploadedFiles,
        tempId,
        originalMessageId: isMessageReply ? targetMessageId : null,
      };

      socket.emit("sendMessage", payload);

      handleSetMessageTextEmpty();
      handleFileEmpty();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  }

  return handleSendMessage;
};