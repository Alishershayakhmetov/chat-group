"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const GoogleAuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Welcome, {session.user?.name}!</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return <button onClick={() => signIn("google")}>Sign in with Google</button>;
};

export default GoogleAuthButton;
