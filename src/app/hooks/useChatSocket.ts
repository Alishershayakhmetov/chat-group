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
    socket.on("chats", setChats);
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
			setChats((prevChats) =>
				prevChats.map((chat) =>
					chat.roomId === message.roomId
						? {
							...chat,
							messageUserName: message.userName || "noName",
							messageText: message.text || "",
							lastMessageTime: message.lastMessageTime.toString(),
						}
					: chat
				)
			);
		})

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

  const handleSetMessages = (newMessage: message) => {
    setMessages((prev) => [...prev, newMessage]);
  }

  return { chats, searchResults, roomData, messages, handleSetMessages };
};
