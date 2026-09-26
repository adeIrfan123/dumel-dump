"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dumel-paper px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 inline-block rotate-[-3deg] border-3 border-black bg-dumel-yellow px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000]">
            WELCOME BACK!
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            dumel<span className="text-dumel-yellow">Dump</span>
          </h1>

          <p className="mt-2 text-sm font-bold">Your little corner of chaos.</p>
        </div>

        <form
          onSubmit={handleLogin}
          aria-busy={loading}
          className="rotate-[-1deg] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000]"
        >
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-black uppercase"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
              aria-describedby={errorMessage ? "login-error" : undefined}
              className="w-full border-3 border-black bg-dumel-paper px-4 py-3 font-bold outline-none transition-all placeholder:text-gray-500 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-black uppercase"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
              aria-describedby={errorMessage ? "login-error" : undefined}
              className="w-full border-3 border-black bg-dumel-paper px-4 py-3 font-bold outline-none transition-all placeholder:text-gray-500 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div
            role="status"
            aria-live="polite"
            className={`mb-4 text-center text-sm font-black ${
              loading ? "block" : "sr-only"
            }`}
          >
            Sedang memproses login...
          </div>

          {errorMessage && (
            <div
              id="login-error"
              role="alert"
              aria-live="assertive"
              className="mb-5 rotate-[1deg] border-3 border-black bg-red-400 p-3 shadow-[4px_4px_0px_#000]"
            >
              <p className="text-sm font-black">⚠️ {errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            aria-label={loading ? "Sedang melakukan login" : "Login"}
            className="w-full border-3 border-black bg-dumel-yellow px-4 py-3 text-lg font-black uppercase shadow-[5px_5px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "LOGGING IN..." : "LOGIN →"}
          </button>

          <div className="mt-6 border-t-3 border-black pt-5 text-center">
            <p className="text-sm font-bold">Belum punya akun?</p>

            <Link
              href="/register"
              className="mt-2 inline-block rotate-[-1deg] border-2 border-black bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-1 hover:bg-dumel-yellow hover:shadow-[4px_4px_0px_#000]"
            >
              DAFTAR SEKARANG →
            </Link>
          </div>
        </form>

        <div className="mt-8 flex justify-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-black bg-dumel-yellow" />
          <span className="h-3 w-3 rounded-full border-2 border-black bg-white" />
          <span className="h-3 w-3 rounded-full border-2 border-black bg-dumel-yellow" />
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
