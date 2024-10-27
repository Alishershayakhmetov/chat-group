"use client";
import { useState, useRef } from "react";
import styles from "../styles/register.module.css";
import TextField from "@mui/material/TextField";
import { Button, Link } from "@mui/material";
import axios from "axios";
import OrDivider from "./orDivider";
import router from "next/router";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [code, setCode] = useState("");

  // Create refs for all input fields
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (
    email: string,
    password?: string,
    fullName?: string,
    code?: string
  ) => {
    if (!isSubmitted) {
      // Submit initial form data
      try {
        const response = await axios.post(
          "http://localhost:3002/api/register-temp",
          {
            fullName,
            email,
            password,
          }
        );

        if (response.status === 200) {
          console.log("Verification code sent to email.");
          setIsSubmitted(true); // Show the verification code field after submission
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
    } else {
      // Submit verification code
      try {
        const response = await axios.post(
          "http://localhost:3002/api/verify-email",
          {
            email,
            code,
          }
        );

        if (response.status === 200) {
          console.log("User verified and registered successfully.");

          setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error verifying code:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    // Prevent form submission on Enter key
    if (e.key === "Enter") {
      e.preventDefault();
    }

    if (e.key === "ArrowDown" || e.key === "Enter") {
      if (field === "fullName") {
        emailRef.current?.focus();
      } else if (field === "email") {
        passwordRef.current?.focus();
      } else if (field === "password" && e.key === "Enter") {
        if (!isSubmitted) {
          // submit data and get code
          handleSubmit(email, password, fullName);
        } else {
          // submit code for verification
          handleSubmit(email, code);
        }
      }
    } else if (e.key === "ArrowUp") {
      if (field === "email") {
        fullNameRef.current?.focus();
      } else if (field === "password") {
        emailRef.current?.focus();
      }
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(email, password, fullName);
      }}
    >
      {!isSubmitted ? (
        <>
          <TextField
            label="Full Name *"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "fullName")} // Add keydown handler
            inputRef={fullNameRef} // Attach ref
          />
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
            autoComplete="current-password"
          />
        </>
      ) : (
        <TextField
          label="Verification Code *"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "code")} // Add keydown handler
          inputRef={codeRef} // Attach ref
        />
      )}
      <Button variant="contained" size="large" type="submit">
        {isSubmitted ? "Verify Code" : "Sign Up"}
      </Button>
      {!isSubmitted && (
        <>
          <p>
            Already Have an Account?{" "}
            <span>
              <Link href="/sign-in">Sign In</Link>
            </span>
          </p>
          <OrDivider />
        </>
      )}
    </form>
  );
}
