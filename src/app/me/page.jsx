"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../provider/AuthProvider";
import NotLogin from "../components/NotLogin";
import LoadingAccount from "../components/LoadingAccount";
import { useState } from "react";

function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Gagal melakukan logout",
      });

      setTimeout(() => {
        setNotification({
          type: "",
          message: "",
        });
      }, 3000);
    }
  }

  if (loading) {
    return <LoadingAccount />;
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <main className="min-h-screen bg-dumel-paper px-5 py-8">
      {notification.message && (
        <div
          className={`fixed top-12 left-1/2 z-[9999] -translate-x-1/2 rounded-lg px-5 py-3 shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="text-lg font-bold">{notification.message}</p>
        </div>
      )}

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block border-2 border-black bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-1 hover:bg-dumel-yellow hover:shadow-[4px_4px_0px_#000]"
          >
            ← BACK
          </Link>

          <div className="mt-6">
            <p className="mb-2 inline-block rotate-[-2deg] border-3 border-black bg-dumel-yellow px-3 py-1 text-xs font-black shadow-[3px_3px_0px_#000]">
              YOURE ACCOUNT
            </p>

            <h1 className="text-4xl font-black uppercase tracking-tight">
              Manage Account
            </h1>

            <p className="mt-2 font-bold">
              Kelola informasi akun DumelDump kamu.
            </p>
          </div>
        </div>

        <section className="rotate-[1deg] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000]">
          <div className="mb-6 flex items-center gap-4 border-b-3 border-black pb-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-dumel-yellow text-3xl font-black shadow-[4px_4px_0px_#000]">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`Avatar ${user.username}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <p className="text-xs font-black uppercase text-gray-500">
                YOUR ACCOUNT
              </p>

              <h2 className="text-2xl font-black">{user.username}</h2>

              <p className="text-sm font-bold text-gray-600">
                DumelDump member
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-black uppercase">Username</p>

            <div className="border-3 border-black bg-dumel-paper px-4 py-3 font-bold">
              {user.username}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-sm font-black uppercase">Email</p>

            <div className="border-3 border-black bg-dumel-paper px-4 py-3 font-bold">
              {user.email}
            </div>
          </div>

          <div className="rotate-[-1deg] border-3 border-black bg-dumel-yellow p-4 shadow-[4px_4px_0px_#000]">
            <p className="text-sm font-black uppercase">🔐 Private by design</p>

            <p className="mt-1 text-sm font-bold">
              Isi Dumel kamu dienkripsi di browser sebelum disimpan ke database.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-black uppercase">Account Actions</h2>

          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="border-3 border-black bg-white px-5 py-3 text-center font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:bg-dumel-yellow hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              ← BACK TO DUMEL
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="border-3 border-black bg-red-400 px-5 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              LOGOUT →
            </button>
          </div>
        </section>

        <div className="mt-10 flex justify-center gap-2">
          <span className="h-3 w-3 rotate-12 border-2 border-black bg-dumel-yellow" />
          <span className="h-3 w-3 -rotate-12 border-2 border-black bg-white" />
          <span className="h-3 w-3 rotate-12 border-2 border-black bg-dumel-yellow" />
        </div>
      </div>
    </main>
  );
}

export default AccountPage;
