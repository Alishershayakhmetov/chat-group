import styles from "../../styles/register.module.css";
import SignUpForm from "@/app/components/signUpForm";
import SignInButton from "@/app/components/googleSignIn";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <img src="/favicon.png" width={50} />
      <h1 className={styles.signUpText}>Sign Up</h1>
      <SignUpForm />

      <SignInButton />
    </div>
  );
}
