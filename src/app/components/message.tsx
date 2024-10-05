import Image from "next/image";
import styles from "../styles/message.module.css";

export const Message = () => {
  const data = {
    imgURL: "/favicon.png",
    message: "Message Message",
    time: "17:45",
    userName: "User Name",
  };
  return (
    <div className={styles.messageBox}>
      <div className={styles.profileImageBox}>
        <Image src={data.imgURL} alt="profile image" width={32} height={32} />
      </div>
      <div className={styles.rightBox}>
        <div className={styles.contentBox}>
          <span>{data.userName}</span>
          <pre>{data.message}</pre>
        </div>
        <div className={styles.relative}>
          <span className={styles.time}>{data.time}</span>
        </div>
      </div>
    </div>
  );
};
