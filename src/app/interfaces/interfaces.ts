export interface MenuChooseProps {
  icon: JSX.Element; // This will be the icon component
  text: string; // This will be the text label
}

export interface chatLastMessageData {
  roomId: string
  chatImageURL: string,
  chatName: string,
  lastMessageTime?: string,
  messageUserName?: string,
  messageText?: string,
  isMessageForwarded?: boolean,
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
  id?: string,
  updatedAt: Date,
  createdAt: Date,
  text: string,
  attachments: attachment[],
  userId?: string,
  roomId?: string,
  isEdited:  Boolean,
  imgURL?: string,
  userName?: string,

  status: MessageStatus,
  tempId?: string,

  originalMessageId?: string,
  originalMsg?: {
    text?: string
    user: {
      name?: string
      lastName?: string
    }
  }

  forwardedMessageId?: string,
  forwardedMsg?: {
    channel?: {
      id: string,
      imgURL: string | null,
      name: string
    },
    chat?: {
      id: string
    },
    group?: {
      id: string,
      imgURL: string | null,
      name: string
    },
    user?: {
      id: string,
      imgURL: string | null,
      name: string | null
    }
  }
}

export enum MessageStatus {
  Sending = "sending",
  Sent = "sent",
  Failed = "failed",
}

export interface attachment {
  fileURL: string,
  fileName: string,
  saveAsMedia?: boolean,
  fileSize?: number | string,
  fileBase64Blur?: string
}

export interface roomData {
  id: string,
  imgURL: string,
  roomName: string,
  roomType: "chat" | "group" | "channel",
  numberOfMembers?: string,
  lastActiveTime?: string,
  isActive?: boolean,
  isMember?: boolean
}

export interface roomDataWithMessages {
  roomData: roomData,
  messages: message[]
}

export function isObjectSearchedChats (object: any): object is searchedChats {
  return 'type' in object;
}

export interface createGroupList {
  id: string, 
  name: string | null, 
  lastName: string | null, 
  imgURL: string | null, 
  status: string | null
}

export interface AddTempMessage {
  text: string,
  attachments: attachment []
}

export interface UserStatus {
  userId: string, 
  status: string, 
  lastSeen: string | undefined 
}