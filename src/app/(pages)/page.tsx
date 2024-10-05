import { App } from "../components/app";
import styles from "../styles/page.module.css";
import Button from "@mui/material/Button";

export default function Home() {
  /*
  return (
    <div className={styles.container}>
      <img src="/favicon.png" alt="Logo" className={styles.image} />
      <p className={styles.p}>
        Connect instantly with friends, family, and colleagues. Start
        conversations, share moments, and stay in touch effortlessly.
      </p>
      <h4 className={styles.p}>Join the conversation now!</h4>
      <a href="/sign-up">
        <Button variant="contained">Register</Button>
      </a>
      <p className={styles.smallInfo}>
        By registering, you agree to our terms and conditions.
      </p>
    </div>
  );
  */
  return <App />;
}
