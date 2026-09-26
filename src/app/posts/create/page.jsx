"use client";

import React, { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { encryptText } from "../../lib/encryption";
import { useRouter } from "next/navigation";
import HeaderForm from "../../components/HeaderForm";
import ButtonX from "../../components/ButtonX";
import FormDumel from "../../components/FormDumel";
import NotLogin from "../../components/NotLogin";

function CreatePost() {
  const router = useRouter();
  const { encryptionKey, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  if (!user) {
    return <NotLogin />;
  }

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengupload gambar");
    }

    return data.imageUrl;
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 3000);
  };

  const handleSubmitCreat = async ({ title, content, mood, files }) => {
    // event.preventDefault();

    if (!encryptionKey) {
      showNotification("error", "Encryption key tidak tersedia");
      return;
    }

    if (loading) {
      showNotification("error", "Sedang memuat data pengguna...");

      return;
    }

    try {
      setLoading(true);

      const encryptedContent = await encryptText(content, encryptionKey);
      const encryptedTitle = await encryptText(title, encryptionKey);

      let imageUrls = [];

      for (const file of files) {
        const imageUrl = await uploadImage(file);

        imageUrls.push(imageUrl);
      }

      console.log("Content asli:", content);
      console.log("Content terenkripsi:", encryptedContent);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: encryptedTitle,
          content: encryptedContent,
          mood,
          imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message || "Gagal membuat post");
        return;
      }

      showNotification("success", "Post berhasil dibuat!");

      console.log("Berhasil mengambil data:", data);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error membuat post:", error);
    }
  };

  return (
    <div className="shadow-[6px_6px_rgba(0,0,0,255)] bg-dumel-paper mt-4 relative">
      {notification.message && (
        <div
          className={`fixed top-12 left-1/2 z-[9999] -translate-x-1/2 rounded-lg px-5 py-3 shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="font-bold text-lg">{notification.message}</p>
        </div>
      )}

      <HeaderForm title={"Create you'r Dumel"} />
      <ButtonX />

      <FormDumel
        onSubmit={handleSubmitCreat}
        loading={loading}
        submitText="Create Post"
      />
    </div>
  );
}

export default CreatePost;
