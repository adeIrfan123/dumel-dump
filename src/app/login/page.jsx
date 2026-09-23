"use client";

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
    const emailValue = event.target.value;
    setEmail(emailValue);
  }

  function handlePassword(event) {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      const message = error.message;
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Login dumelDump</h1>

      <form action="" onSubmit={handleLogin} className="border border-red-500">
        <div>
          <label htmlFor="">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-amber-50"
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePassword}
            className="border border-blue-400"
          />
        </div>

        {errorMessage && (
          <div>
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="border border-white"
          >
            {loading ? "sedang login" : "login"}
          </button>
          <p>
            belum punya akun??? <a href="/register">daftar</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
