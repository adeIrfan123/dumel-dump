"use client";

import React, { useEffect, useState } from "react";
import HeaderForm from "../../../components/HeaderForm";
import ButtonX from "../../../components/ButtonX";
import FormDumel from "../../../components/FormDumel";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../provider/AuthProvider";
import { decryptText, encryptText } from "../../../lib/encryption";

function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { encryptionKey, loading: authLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 3000);
  };

  useEffect(() => {
    if (authLoading || !encryptionKey) {
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();

        console.log("data:", data);
        console.log("data post", data.posts);

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data post");
        }

        const decryptedTitle = await decryptText(
          data.posts.title,
          encryptionKey,
        );

        const decryptedContent = await decryptText(
          data.posts.content,
          encryptionKey,
        );

        setPost({
          ...data.posts,
          title: decryptedTitle,
          content: decryptedContent,
        });
      } catch (error) {
        console.error("Fetch post error:", error);

        showNotification("error", error.message || "Gagal mengambil data post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, encryptionKey, authLoading]);

  const handleSubmit = async ({
    title,
    content,
    mood,
    files,
    images,
    deletedImages,
  }) => {
    if (!encryptionKey) {
      showNotification("error", "Encryption key tidak tersedia");
      return;
    }

    try {
      setSaving(true);

      const encryptedTitle = await encryptText(title, encryptionKey);

      const encryptedContent = await encryptText(content, encryptionKey);

      const imageUrls = [];

      for (const file of files) {
        const formData = new FormData();

        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Gagal mengupload gambar");
        }

        imageUrls.push(uploadData.imageUrl);
      }

      console.log("Gambar yang dihapus:", deletedImages);
      console.log("Gambar baru:", imageUrls);
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: encryptedTitle,
          content: encryptedContent,
          mood,
          deletedImageIds: deletedImages,
          imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal meperbarui post");
      }

      showNotification("success", "Post berhasil diperbarui");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Update post error:", error);

      showNotification("error", "Gagal memperbarui post");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Memuat data post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Post tidak ditemukan.</p>
      </div>
    );
  }

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
      <HeaderForm title={"Edit you'r Dumel"} />
      <ButtonX />

      <FormDumel
        onSubmit={handleSubmit}
        submitText="Update post"
        initialData={{
          title: post.title,
          content: post.content,
          images: post.images,
          mood: post.mood,
        }}
        loading={saving}
      />
    </div>
  );
}

export default EditPostPage;
