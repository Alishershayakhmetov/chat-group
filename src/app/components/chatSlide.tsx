import {
  chatLastMessageData,
  isObjectSearchedChats,
  searchedChats,
} from "../interfaces/interfaces";
import styles from "../styles/chat.module.css";
import { FormatDate } from "../utils/formatDate";

export const ChatSlide = ({
  data,
}: {
  data: chatLastMessageData | searchedChats;
}) => {
  if (isObjectSearchedChats(data))
    return (
      <div className={styles.slide}>
        <img src={data.imgURL} className={styles.image} />
        <div className={styles.infoBox}>
          <div className={styles.info}>
            <p>
              {data.type === "user"
                ? `${data.name} ${data.last_name}`
                : data.name}
            </p>
            <p>{data.messageTime && FormatDate(data.messageTime)}</p>
          </div>
          <div className={styles.info}>
            <p>
              {data.messageAuthor &&
                data.lastMessageContent &&
                `${data.messageAuthor}: ${data.lastMessageContent}`}
            </p>
            <p>
              <span>{data.icon}</span>
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.slide}>
      <img src={data.imgURL} className={styles.image} />
      <div className={styles.infoBox}>
        <div className={styles.info}>
          <p>{data.chatName}</p>
          <p>{FormatDate(data.messageTime)}</p>
        </div>
        <div className={styles.info}>
          <p>{`${data.messageAuthor}: ${data.MessageContent}`}</p>
          <p>
            <span>{data.icon}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
