import { chatLastMessageData } from "../interfaces/interfaces";
import styles from "../styles/chat.module.css";
import { FormatDate } from "../utils/formatDate";

export const ChatSlide = ({ data }: { data: chatLastMessageData }) => {
  return (
    <div className={styles.slide}>
      <img src={data.imgURL} className={styles.image} />
      <div className={styles.infoBox}>
        <div className={styles.info}>
          <p>{data.chatName}</p>
          <p>{FormatDate(data.time)}</p>
        </div>
        <div className={styles.info}>
          <p>{`${data.author}: ${data.lastMessage}`}</p>
          <p>
            <span>{data.icon}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
