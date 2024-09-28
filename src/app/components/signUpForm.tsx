"use client";
import { useState } from "react";
import styles from "../styles/register.module.css";
import TextField from "@mui/material/TextField";
import { Button, Divider, Link, styled } from "@mui/material";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log([fullName, email, password]);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextField
        id="outlined-basic"
        label="Full Name *"
        variant="outlined"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Email *"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Password *"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" size="large" type="submit">
        Sign Up
      </Button>
      <p>
        Already Have an Account?{" "}
        <span>
          <Link href="/sign-in">Sign In</Link>
        </span>
      </p>
      <Root>
        <Divider>or</Divider>
      </Root>
    </form>
  );
}
