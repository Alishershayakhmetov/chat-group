import { TextField } from "@mui/material";
import styles from "../styles/app.module.css";
import { ChatSlide } from "./chatSlide";
import { ChatHeader } from "./chatHeader";
import { Message } from "./message";
import { LeftSlide } from "./leftSlide";
import { MessageInput } from "./messageInput";

export const App = () => {
  return (
    <main className={styles.main}>
      <section className={styles.leftSlide}>
        <header className={styles.listHeader}>
          <LeftSlide />
          <TextField
            id="outlined-basic"
            label="Find..."
            variant="outlined"
            style={{ width: "100%" }}
            size="small"
          />
        </header>
        <div className={styles.contactsList}>
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />

          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />

          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
          <ChatSlide />
        </div>
      </section>
      <article className={styles.rightSlide}>
        <div className={styles.contentBox}>
          <ChatHeader />
          <div className={styles.messageBox}>
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />

            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
          <MessageInput />
        </div>
      </article>
    </main>
  );
};
