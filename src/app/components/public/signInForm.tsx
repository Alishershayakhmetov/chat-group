"use client";
import { useRef, useState } from "react";
import styles from "../styles/register.module.css";
import TextField from "@mui/material/TextField";
import { Button, Link } from "@mui/material";
import OrDivider from "./orDivider";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (email: String, password: String) => {
    // HANDLE CASE: not fully entered form
    if (!email || !password) return;
    try {
      const response = await axios.post(
        "http://localhost:3002/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error registering user:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    // Prevent form submission on Enter key
    if (e.key === "Enter") {
      e.preventDefault();
    }

    if (e.key === "ArrowDown" || e.key === "Enter") {
      if (field === "email") {
        passwordRef.current?.focus();
      } else if (field === "password" && e.key === "Enter") {
        handleSubmit(email, password);
      }
    } else if (e.key === "ArrowUp") {
      if (field === "password") {
        emailRef.current?.focus();
      }
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(email, password);
      }}
    >
      <TextField
        label="Email *"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, "email")} // Add keydown handler
        inputRef={emailRef} // Attach ref
        autoComplete="email"
      />
      <TextField
        label="Password *"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, "password")} // Add keydown handler
        inputRef={passwordRef} // Attach ref
        autoComplete="current-password" // Add this line
      />
      <div className={styles.leftAlign}>
        <Link href="/reset-password">Forgot Password?</Link>
      </div>

      <Button variant="contained" size="large" type="submit">
        Sign In
      </Button>
      <p>
        Don't Have an Account?{" "}
        <span>
          <Link href="/sign-up">Sign Up</Link>
        </span>
      </p>
      <OrDivider />
    </form>
  );
}
