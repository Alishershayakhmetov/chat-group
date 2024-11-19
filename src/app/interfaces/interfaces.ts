export interface MenuChooseProps {
  icon: JSX.Element; // This will be the icon component
  text: string; // This will be the text label
}

export interface chatLastMessageData {
  imgURL: string,
  chatName: string,
  time: Date,
  author: string,
  lastMessage: string,
  icon: number,
}

export interface chatData {
  id: string,
  data: chatLastMessageData,
}