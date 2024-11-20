import { Socket } from "socket.io-client";

export interface MenuChooseProps {
  icon: JSX.Element; // This will be the icon component
  text: string; // This will be the text label
}

export interface chatLastMessageData {
  imgURL: string,
  chatName: string,
  messageTime: Date,
  messageAuthor: string,
  MessageContent: string,
  icon?: number,
}

export interface chatData {
  id: string,
  data: chatLastMessageData,
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
  messageTime: Date | null,
  messageAuthor: string | null,
  lastMessageContent: string | null,
  icon: number | null
}

export interface CustomSocket extends Socket {
  current: Socket;
}

export function isObjectSearchedChats (object: any): object is searchedChats {
  return 'type' in object;
}