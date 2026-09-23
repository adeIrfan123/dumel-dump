"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function RegisterPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserNameInput = (event) => {
    const userNameValue = event.target.value;
    setUserName(userNameValue);
  };

  const handleEmailInput = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
  };

  const handlePasswordInput = (event) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
  };

  const handleFormRegister = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      router.push("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Resiter dumelDump</h1>
      <form action="" onSubmit={handleFormRegister}>
        <div>
          <label htmlFor="">User name</label>
          <input
            type="text"
            value={userName}
            onChange={handleUserNameInput}
            className="border border-white"
          />
        </div>
        <div>
          <label htmlFor="">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailInput}
            className="border border-white"
          />
        </div>
        <div>
          <label htmlFor="" className="border boder-white">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordInput}
            className="border border-white"
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div>
          <button className="border disabled:{loading} border-white">
            {loading ? "Sedang mendaftar" : "Mendaftar"}
          </button>
          <p>
            Sudah punya akun??? <a href="/login">login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
