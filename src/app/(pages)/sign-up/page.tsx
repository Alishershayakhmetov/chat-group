import styles from "../../styles/register.module.css";
import SignUpForm from "@/app/components/public/signUpForm";
import SignInButton from "@/app/components/public/googleSignIn";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <img src="/favicon.png" width={50} />
      <h1
        className={styles.signUpText}
        style={{ color: "var(--color-text-default)" }}
      >
        Sign Up
      </h1>
      <SignUpForm />

      <SignInButton />
    </div>
  );
}
