import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../contexts/socketContext";

export const useChatForm = () => {
  const { socket } = useSocketContext();
  const [messageText, setMessageText] = useState("");
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [targetMessageId, setTargetMessageId] = useState<string | undefined>(
    undefined
  );
  const [isMessageReply, setIsMessageReply] = useState(false);

  const handleEditMessage = ({
    messageId,
    messageText,
  }: {
    messageId: string;
    messageText: string;
  }) => {
    setIsMessageEdit(true);
    setTargetMessageId(messageId);
    setMessageText(messageText);
  };

  const handleReplyMessage = ({ messageId }: { messageId: string }) => {
    setIsMessageReply(true);
    setTargetMessageId(messageId);
  };

  const handleSubscribe = (roomId: string) => {
    socket.emit("subscribe", roomId);
  };

	const handleSetText = (text: string) => {
    setMessageText(text);
  };

	const handleEmojiSelect = (emoji: { native: string }) => {
    setMessageText(messageText + emoji.native);
  };

	const handleSetIsMessageReplyFalse = () => {
		setIsMessageReply(false);
	}

	const handleSetIsMessageEditFalse = () => {
		setIsMessageEdit(false);
	}

	const handleSetTargetMessageIdUndefined = () => {
		setTargetMessageId(undefined);
	}

	const handleSetMessageTextEmpty = () => {
		setMessageText("");
	}

	return {messageText, isMessageEdit, targetMessageId, isMessageReply, handleEditMessage, handleReplyMessage, handleSubscribe, handleSetText, handleEmojiSelect, handleSetIsMessageReplyFalse, handleSetIsMessageEditFalse, handleSetTargetMessageIdUndefined, handleSetMessageTextEmpty};
}