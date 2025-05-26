
// src/contexts/auth-context.tsx
"use client";

import type { User } from "firebase/auth";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type OAuthCredential } from "firebase/auth";
import * as React from "react";
import { auth, googleAuthProvider } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signInWithGoogleAndGetGmailToken: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (!currentUser) {
        setAccessToken(null); // Clear access token on sign out
      }
      // Note: We get the access token during signInWithPopup, not directly from onAuthStateChanged for external services like Gmail API.
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogleAndGetGmailToken = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = result.credential as OAuthCredential; // Cast to specific type
      if (credential && credential.accessToken) {
        setAccessToken(credential.accessToken);
        setUser(result.user);
        console.log("Google Sign-In successful, access token obtained.");
      } else {
        console.error("Google Sign-In succeeded but no access token found in credential.");
        setAccessToken(null);
      }
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error);
      setAccessToken(null);
      // Handle specific errors (e.g., popup_closed_by_user, network_error)
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOutGoogle = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAccessToken(null);
      if (typeof window !== 'undefined' && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance && authInstance.isSignedIn.get()) {
          authInstance.signOut();
          authInstance.disconnect(); // Revokes all granted scopes
          console.log("GAPI client signed out and disconnected.");
        }
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, signInWithGoogleAndGetGmailToken, signOutGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
