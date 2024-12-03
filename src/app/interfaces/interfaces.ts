import { Socket } from "socket.io-client";

export interface MenuChooseProps {
  icon: JSX.Element; // This will be the icon component
  text: string; // This will be the text label
}

export interface chatLastMessageData {
  roomId: string
  chatImgURL: string,
  chatName: string,
  lastMessageTime: string,
  messageUserName: string,
  messageText: string,
  isMessageForwarded: boolean,
  numberOfUnreadMessages?: number,
}

export interface searchedChats {
  id: string,
  is_public: boolean | null,
  last_name: string | null,
  last_name_similarity: number | null,
  name: string,
  name_similarity: number,
  type: "user" | 'channel',

  imgURL: string,
  messageTime: string | null,
  messageAuthor: string | null,
  lastMessageContent: string | null,
  icon: number | null
}

export interface message {
  id: string,
  updatedAt: string,
  createdAt: string,
  text: string, // Text
  attachments: string[], // image, video, audio, file
  userId: string,
  roomId: string,
  isEdited:  Boolean,
  imgURL: string,
  userName: string
}

export interface attachments {
  id: string,
  messageId: string,
  fileUrl: String,
  createdAt: Date,
}

export interface roomData {
  id: string,
  imgURL: string,
  roomName: string,
  roomType: "chat" | "group" | "channel",
  numberOfMembers?: string,
  lastActiveTime?: Date,
  isActive?: Boolean
}

export interface roomDataWithMessages {
  roomData: roomData,
  messages: message[]
}

export function isObjectSearchedChats (object: any): object is searchedChats {
  return 'type' in object;
}