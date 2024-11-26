import Image from "next/image";
import styles from "../styles/message.module.css";
import { message } from "../interfaces/interfaces";
import { extractTime } from "../utils/formatDate";

export const Message = ({ data }: { data: message }) => {
  return (
    <div className={styles.messageBox}>
      <div className={styles.profileImageBox}>
        <Image src={data.imgURL} alt="profile image" width={32} height={32} />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.contentBox}>
          <span>{data.userName}</span>
          <pre>{data.text}</pre>
        </div>
        <div className={styles.relative}>
          <span className={styles.time}>{extractTime(data.date)}</span>
        </div>
      </div>
    </div>
  );
};
