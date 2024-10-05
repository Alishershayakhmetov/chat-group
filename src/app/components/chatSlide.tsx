import styles from "../styles/chat.module.css";

export const ChatSlide = () => {
  const data = {
    imgURL: "/favicon.png",
    chatName: "Chat Name",
    time: "17:45",
    lastMessage: "qwertyasdfghzxcvbn qwertyasdfghzxcvbn qwertyasdfghzxcvbn",
    icon: "175",
  };
  return (
    <div className={styles.slide}>
      <img src={data.imgURL} className={styles.image} />
      <div className={styles.infoBox}>
        <div className={styles.info}>
          <p>{data.chatName}</p>
          <p>{data.time}</p>
        </div>
        <div className={styles.info}>
          <p>{data.lastMessage}</p>
          <p>
            <span>{data.icon}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
