import { useChatSocketContext } from "../contexts/chatSocketContext";
import { AddTempMessage, MessageStatus, message } from "../interfaces/interfaces";
import { v4 as uuid } from "uuid";

export const useAddTempMessage = () => {
	const { handleSetNewMessage } = useChatSocketContext(); // Move the hook call here

	const handleAddTempMessage = ({ text, attachments }: AddTempMessage) => {
		const tempId = uuid();
		const tempMes: message = {
			tempId,
			text,
			attachments,
			updatedAt: new Date(),
			createdAt: new Date(),
			isEdited: false,
			status: MessageStatus.Sending,
		};

		handleSetNewMessage(tempMes);
		return tempId;
	}
	return handleAddTempMessage;
};
