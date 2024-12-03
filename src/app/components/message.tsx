import Image from "next/image";
import styles from "../styles/message.module.css";
import { message } from "../interfaces/interfaces";
import { extractTime } from "../utils/formatDate";
import UserImage from "./userImage";

export const Message = ({ data }: { data: message }) => {
  console.log(data);
  return (
    <div className={styles.messageBox}>
      <div className={styles.profileImageBox}>
        <UserImage
          src={data.imgURL}
          alt="profile image"
          width={32}
          height={32}
        />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.contentBox}>
          <span>{data.userName}</span>
          <pre>{data.text}</pre>
        </div>
        <div className={styles.relative}>
          <span className={styles.time}>{extractTime(data.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};
