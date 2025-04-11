import { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/socketContext";
import { chatLastMessageData, searchedChats, roomData, message } from "../interfaces/interfaces";
import { NewMessageNotification } from "../interfaces/app";

export const useChatSocket = () => {
  const { socket } = useSocketContext();
  const [chats, setChats] = useState<chatLastMessageData[]>([]);
  const [searchResults, setSearchResults] = useState<searchedChats[] | null>(null);
  const [roomData, setRoomData] = useState<roomData | null>(null);
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    socket.on("chats", (chats: chatLastMessageData[]) => {
      setChats(chats.sort((a, b) => {
        // Convert ISO strings to timestamps for comparison
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      }));
    });
    socket.on("searchResult", setSearchResults);
    socket.on("enterChat", (data: { roomData: roomData; messages: message[] }) => {
      setRoomData(data.roomData);
      setMessages(data.messages);
    });
    socket.on("newMessage", (data: message) => {
      setMessages((prevMessages) => {
        const DuplicateIndex = prevMessages.findIndex(
          (message) => message.tempId === data.tempId
        );

        if (DuplicateIndex !== -1) {
          // Replace the existing message with the new data
          const updatedMessages = [...prevMessages];
          updatedMessages[DuplicateIndex] = data;
          return updatedMessages;
        }

        // Add new message to the array
        return [...prevMessages, data];
      });
    });
		socket.on("createNewGroup", (newGroup: chatLastMessageData) => {
      setChats((prevChats) => [newGroup, ...prevChats]);
    });
		socket.on("createNewChannel", (newChannel: chatLastMessageData) => {
      setChats((prevChats) => [newChannel, ...prevChats]);
    });
		socket.on("deleteMessage", (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    });
		socket.on("editMessage", (formattedMessage: message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === formattedMessage.id
            ? { ...msg, ...formattedMessage } // Merge updated properties
            : msg
        )
      );
    });
		socket.on("newMessageNotification", (message: NewMessageNotification) => {
      setChats((prevChats) => {
        // Find the index of the chat that received the new message
        const chatIndex = prevChats.findIndex(chat => chat.roomId === message.roomId);
        
        // If chat not found, return existing chats
        if (chatIndex === -1) return prevChats;
        
        // Create a new array without the chat that's being moved
        const otherChats = prevChats.filter((_, index) => index !== chatIndex);
        
        // Update the chat with new message data
        const updatedChat: chatLastMessageData = {
          ...prevChats[chatIndex],
          messageUserName: message.userName || "noName",
          messageText: message.text || "",
          lastMessageTime: message.lastMessageTime,
          numberOfUnreadMessages: (prevChats[chatIndex].numberOfUnreadMessages || 0) + 1
        };
        
        // Return the updated chat first, followed by other chats
        return [updatedChat, ...otherChats];
      });
    });

    return () => {
      socket.off("chats");
      socket.off("searchResult");
      socket.off("enterChat");
      socket.off("newMessage");
			socket.off("createNewGroup");
      socket.off("createNewChannel");
      socket.off("deleteMessage");
      socket.off("editMessage");
      socket.off("newMessageNotification");
    };
  }, [socket]);

  const handleSetNewMessage = (newMessage: message) => {
    setMessages((prev) => [...prev, newMessage]);
  }

  const handleSetOldMessages = (oldMessages: message[]) => {
    setMessages((prev) => {
      const existingIds = new Set(prev.map(msg => msg.id));
      const filteredOldMessages = oldMessages.filter(msg => !existingIds.has(msg.id));
      return [...filteredOldMessages, ...prev];
    });
  };  

  return { chats, searchResults, roomData, messages, handleSetNewMessage, handleSetOldMessages };
};
