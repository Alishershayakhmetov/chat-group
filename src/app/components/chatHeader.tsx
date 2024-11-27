import Image from "next/image";
import styles from "../styles/chat.module.css";
import { roomData } from "../interfaces/interfaces";
import UserImage from "./userImage";

export const ChatHeader = ({ data }: { data: roomData | undefined }) => {
  const chatStatus =
    data && data.roomType === "chat"
      ? `last seen on ${data.lastActiveTime}`
      : data?.roomType === "group"
      ? `${data.numberOfMembers} members`
      : `${data?.numberOfMembers} subscribers`;

  return (
    <div className={styles.chatHeaderBox}>
      <div className={styles.chatNameBox}>
        <UserImage className={styles.image} src={data && data.imgURL} />
        <div className={styles.chatNameInfoBox}>
          <p>{data && data.roomName}</p>
          <p>{chatStatus}</p>
        </div>
      </div>
      <div>
        <button className={styles.resetDefaultButton}>
          <Image
            src={"/icon-search-2.svg"}
            alt="Chat Image"
            width={24}
            height={24}
            className={styles.searchIcon}
          />
        </button>
      </div>
    </div>
  );
};
