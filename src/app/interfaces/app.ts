export interface NewMessageNotification {
  roomId: any;
  userName: string | null | undefined;
	userId: string;
	text: string | null;
	isAttachment: boolean;
	lastMessageTime: String;
}