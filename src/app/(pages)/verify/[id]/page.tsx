"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import URLS from "@/app/utils/urls";

export default function VerifyEmail() {
  const router = useRouter();
  const { id } = router.query;
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    const verifyEmail = async () => {
      if (!id) return;

      try {
        const response = await axios.post(URLS.verifyEmail, { id });

        if (response.status === 200) {
          setVerificationStatus(
            "Verification successful! Your account is now active."
          );
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setVerificationStatus("Verification failed. Please try again.");
        }
      } catch (error) {
        setVerificationStatus("An error occurred during verification.");
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data || error.message);
        }
      }
    };

    verifyEmail();
  }, [id]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {verificationStatus === null ? (
        <>
          <CircularProgress />
          <Typography variant="h6" component="p">
            Verifying your email...
          </Typography>
        </>
      ) : (
        <Typography variant="h6" component="p">
          {verificationStatus}
        </Typography>
      )}
    </div>
  );
}
