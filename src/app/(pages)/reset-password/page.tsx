"use client";
import { useState } from "react";
import styles from "../../styles/register.module.css";
import TextField from "@mui/material/TextField";
import { Button, Divider, Link, styled } from "@mui/material";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log([email]);
  };

  return (
    <div className={styles.container}>
      <img src="/favicon.png" width={50} />
      <h1 className={styles.signUpText}>Reset Password</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="Email *"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" size="large" type="submit">
          Sign In
        </Button>
        <p>
          Don't Have an Account?{" "}
          <span>
            <Link href="/sign-up">Sign Up</Link>
          </span>
        </p>
      </form>
      <div></div>
    </div>
  );
}
