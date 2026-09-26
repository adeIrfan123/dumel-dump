import Link from "next/link";
import React from "react";

function NotLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dumel-paper px-5">
      <div className="w-full max-w-md rotate-[-1deg] border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_#000]">
        <div className="mb-4 text-5xl">🔒</div>

        <h1 className="text-3xl font-black uppercase">Not Logged In</h1>

        <p className="mt-2 font-bold">Kamu harus login terlebih dahulu.</p>

        <Link
          href="/login"
          className="mt-6 inline-block border-3 border-black bg-dumel-yellow px-5 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          LOGIN →
        </Link>
      </div>
    </main>
  );
}

export default NotLogin;
