"use client";

import { useAuth } from "@clerk/nextjs";
import db from "../lib/instant";
import { useEffect } from "react";

export default function ClerkInstant({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, signOut } = useAuth();

  const signInToInstantWithClerkToken = async () => {
    // getToken gets the jwt from Clerk for your signed in user.
    const idToken = await getToken();

    if (!idToken) {
      // No jwt, can't sign in to instant
      return;
    }

    // Create a long-lived session with Instant for your clerk user
    // It will look up the user by email or create a new user with
    // the email address in the session token.
    db.auth.signInWithIdToken({
      clientName: process.env.NEXT_PUBLIC_INSTANT_CLIENT_NAME!,
      idToken: idToken,
    });
  };

  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return <>{children}</>;
}
