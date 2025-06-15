
// src/contexts/auth-context.tsx
"use client";

import type { User } from "firebase/auth";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type OAuthCredential } from "firebase/auth";
import * as React from "react";
import { auth as firebaseAuth, googleAuthProvider, isFirebaseConfigured } from "@/lib/firebase/config"; // Renamed auth to firebaseAuth to avoid conflict

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isConfigured: boolean; // To indicate if Firebase is set up
  signInWithGoogleAndGetGmailToken: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setIsLoading(false);
      console.warn("AuthProvider: Firebase is not configured. Auth features will be disabled.");
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (!currentUser) {
        setAccessToken(null); // Clear access token on sign out
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogleAndGetGmailToken = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      console.error("Firebase not configured. Cannot sign in.");
      // Optionally, show a toast or alert to the user
      return;
    }
    setIsLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const credential = result.credential as OAuthCredential;
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
    } finally {
      setIsLoading(false);
    }
  };

  const signOutGoogle = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      console.error("Firebase not configured. Cannot sign out.");
      return;
    }
    setIsLoading(true);
    try {
      await firebaseSignOut(firebaseAuth);
      setUser(null);
      setAccessToken(null);
      if (typeof window !== 'undefined' && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance && authInstance.isSignedIn.get()) {
          authInstance.signOut();
          authInstance.disconnect();
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
    <AuthContext.Provider 
      value={{ 
        user, 
        accessToken, 
        isLoading, 
        isConfigured: isFirebaseConfigured && !!firebaseAuth, 
        signInWithGoogleAndGetGmailToken, 
        signOutGoogle 
      }}
    >
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
