import { useCallback, useMemo, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import type { GoogleUser } from "../types/types";
import { parseJwt } from "../utils/parseJwt";

const STORAGE_KEY = "google_user";

type GoogleCredentialPayload = {
  name?: string;
  email?: string;
  picture?: string;
};

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const hasClientId = useMemo(
    () => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
    []
  );

  const connectWorkspace = useGoogleLogin({
    flow: "auth-code",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ].join(" "),
    onSuccess: async (codeResponse) => {
      try {
        await fetch("/api/auth/google/exchange-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code: codeResponse.code }),
        });
      } catch (error) {
        console.error("Failed to exchange Google auth code:", error);
      } 
    },
    onError: () => {
      console.error("Google Workspace authorization failed.");
    },
  });

  const handleGoogleSignInSuccess = useCallback(
    async (credentialResponse: { credential?: string }) => {
      try {
        if (!credentialResponse.credential) {
          throw new Error("No Google credential returned.");
        }

        const decoded = parseJwt(
          credentialResponse.credential
        ) as GoogleCredentialPayload;

        const loggedInUser: GoogleUser = {
          name: decoded.name ?? "",
          email: decoded.email ?? "",
          picture: decoded.picture ?? "",
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      } catch (error) {
        console.error("Google sign-in failed:", error);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    logout,
    hasClientId,
    handleGoogleSignInSuccess,
    connectWorkspace
   };
}