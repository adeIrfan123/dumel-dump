"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../provider/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, encryptionKey, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // return <p>Silakan login terlebih dahulu.</p>;
    return router.push("/login");
  }

  const handleBtnLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard DumelDump</h1>

      <p>Selamat datang, {user.username}</p>

      <p>Email: {user.email}</p>

      <p>Encryption Key: {encryptionKey ? "Tersedia" : "Tidak tersedia"}</p>

      <button onClick={handleBtnLogout}>Logout</button>
    </div>
  );
}
