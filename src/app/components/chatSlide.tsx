import { Typography } from "@mui/material";
import { useSocketContext } from "../contexts/socketContext";
import {
  chatLastMessageData,
  isObjectSearchedChats,
  searchedChats,
} from "../interfaces/interfaces";
import styles from "../styles/chat.module.css";
import { FormatDate } from "../utils/formatDate";
import UserImage from "./userImage";

export const ChatSlide = ({
  data,
}: {
  data: chatLastMessageData | searchedChats;
}) => {
  const { socket } = useSocketContext();
  if (isObjectSearchedChats(data)) {
    return (
      <div
        className={styles.slide}
        onClick={() => {
          socket.emit("enterChat", data.id);
        }}
      >
        <UserImage src={data.imgURL} className={styles.image} alt="qwerty" />
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
            <Typography>
              {data.messageAuthor &&
                `${data.messageAuthor}: ${
                  data.lastMessageContent !== null
                    ? data.lastMessageContent
                    : "media"
                }`}
            </Typography>
            <p>
              <span>{data.icon}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={styles.slide}
      onClick={() => {
        socket.emit("enterChat", data.roomId);
      }}
    >
      <UserImage src={data.chatImgURL} className={styles.image} />
      <div className={styles.infoBox}>
        <div className={styles.info}>
          <p>{data.chatName}</p>
          <p style={{ width: "50px" }}>{FormatDate(data.lastMessageTime)}</p>
        </div>
        <div className={styles.info}>
          <p>
            {data.messageUserName &&
              `${data.messageUserName}: ${
                data.messageText ? data.messageText : "media"
              }`}
          </p>
          <p>
            <span>{data.numberOfUnreadMessages}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
