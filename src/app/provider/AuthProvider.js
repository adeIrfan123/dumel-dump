"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  deriveEncryptionKey,
  exportEncryptionKey,
  importEncryptionKey,
} from "../lib/encryption";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);

        const storedKey = localStorage.getItem("dumeldump_encryption_key");

        if (storedKey) {
          try {
            const key = await importEncryptionKey(storedKey);

            setEncryptionKey(key);
          } catch (error) {
            console.error("Gagal memulihkan encrption key:", error);

            localStorage.removeItem("dumeldump_encryption_key");
            setEncryptionKey(null);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function login(email, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan login");
      }

      const key = await deriveEncryptionKey(password, data.user.encryptionSalt);

      const exportedKey = await exportEncryptionKey(key);

      localStorage.setItem("dumeldump_encryption_key", exportedKey);

      setUser(data.user);
      setEncryptionKey(key);

      return data.user;
    } catch (error) {
      console.error("Login error:", error);

      throw error;
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan logout");
      }

      localStorage.removeItem("dumeldump_encryption_key");

      setUser(null);
      setEncryptionKey(null);
    } catch (error) {
      console.error("Logout error:", error);

      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        encryptionKey,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
