import styles from "../../styles/register.module.css";
import SignInForm from "@/app/components/signInForm";
import SignInButton from "@/app/components/googleSignIn";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <img src="/favicon.png" width={50} />
      <h1 className={styles.signUpText}>Sign In</h1>
      <SignInForm />
      <SignInButton />
    </div>
  );
}
