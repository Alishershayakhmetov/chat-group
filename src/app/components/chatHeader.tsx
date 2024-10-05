import Image from "next/image";
import styles from "../styles/chat.module.css";

export const ChatHeader = () => {
  const data = {
    imgURL: "/favicon.png",
    chatName: "Chat Name",
    isGroup: false,
    isChannel: false,
    isChat: true,
    numberOfMembers: "2",
    time: "17:45",
  };
  const chatStatus = data.isChat
    ? `Last seen on ${data.time}`
    : data.isGroup
    ? `${data.numberOfMembers} members`
    : `${data.numberOfMembers} subscribers`;
  return (
    <div className={styles.chatHeaderBox}>
      <div className={styles.chatNameBox}>
        <img className={styles.image} src={data.imgURL} />
        <div className={styles.chatNameInfoBox}>
          <p>{data.chatName}</p>
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
