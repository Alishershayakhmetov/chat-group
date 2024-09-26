import styles from "./page.module.css";
import Button from "@mui/material/Button";

export default function Home() {
  return (
    <div className={styles.container}>
      <img src="/favicon.png" alt="Logo" className={styles.image} />
      <p className={styles.p}>
        Connect instantly with friends, family, and colleagues. Start
        conversations, share moments, and stay in touch effortlessly.
        <h4>Join the conversation now!</h4>
      </p>
      <Button variant="contained">Register</Button>
      <p className={styles.smallInfo}>
        By registering, you agree to our terms and conditions.
      </p>
    </div>
  );
}
