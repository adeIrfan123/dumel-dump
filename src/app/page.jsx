"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./provider/AuthProvider";
import { decryptText, decryptFile } from "./lib/encryption";
import ImageStack from "./components/ImageStack";
import { useRouter } from "next/navigation";
import NotLogin from "./components/NotLogin";
import LoadingAccount from "./components/LoadingAccount";

export default function Home() {
  const router = useRouter();
  const { encryptionKey, loading, user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [selectedMood, setSelectedMood] = useState("ALL");

  const moods = {
    HAPPY: "🤩",
    ANGRY: "😡",
    SAD: "😢",
    LAUGHING: "😆",
    CONFUSED: "🫤",
  };

  const handleToggleBtn = (id) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  const decryptImage = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Gagal mengambil gambar terenkripsi");
    }

    const encryptedBlob = await response.blob();

    const decryptedBlob = await decryptFile(encryptedBlob, encryptionKey);

    return URL.createObjectURL(decryptedBlob);
  };

  const handleEditPost = (id) => {
    router.push(`/posts/${id}/edit`);
  };

  const handleDeletePost = (post) => {
    setPostToDelete(post);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) {
      return;
    }

    try {
      setDeletingPost(true);

      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus post");
      }

      setPosts((prev) => prev.filter((post) => post.id !== postToDelete.id));

      setActiveMenu(null);
      setPostToDelete(null);
    } catch (error) {
      console.error("Delete post error:", error);

      setError(error instanceof Error ? error.message : "Gagal menghapus post");
    } finally {
      setDeletingPost(false);
    }
  };

  const cancelDeletePost = () => {
    if (deletingPost) {
      return;
    }

    setPostToDelete(null);
  };

  useEffect(() => {
    if (loading || !encryptionKey) {
      return;
    }

    const getPosts = async () => {
      try {
        setLoadingPosts(true);
        setError("");

        const response = await fetch("/api/posts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data posts");
        }

        const decryptedPosts = await Promise.all(
          data.posts.map(async (post) => {
            const decryptedTitle = await decryptText(post.title, encryptionKey);

            const decryptedContent = await decryptText(
              post.content,
              encryptionKey,
            );

            const decryptedImages = await Promise.all(
              post.images.map(async (image) => {
                const response = await fetch(image.imageUrl);

                if (!response.ok) {
                  throw new Error("Gagal mengambil gambar terenkripsi");
                }

                const encryptedBlob = await response.blob();

                const decryptedBlob = await decryptFile(
                  encryptedBlob,
                  encryptionKey,
                );

                const imageUrl = URL.createObjectURL(decryptedBlob);

                return {
                  ...image,
                  imageUrl,
                };
              }),
            );

            console.log("POST IMAGES:", post.images);

            return {
              ...post,
              title: decryptedTitle,
              content: decryptedContent,
              images: decryptedImages,
            };
          }),
        );

        setPosts(decryptedPosts);
      } catch (error) {
        console.error("Error mengambil posts:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Terjadi kesalahan saat mengambil posts");
        }
      } finally {
        setLoadingPosts(false);
      }
    };

    getPosts();
  }, [loading, encryptionKey]);

  const filteredPosts =
    selectedMood === "ALL"
      ? posts
      : posts.filter((post) => post.mood === selectedMood);

  if (loading) {
    return <LoadingAccount />;
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="relative min-h-screen pb-32">
      <header className="mb-10">
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="absolute -left-2 -top-3 h-3 w-16 rotate-[-4deg] bg-dumel-yellow opacity-80" />

            <h1 className="relative text-5xl font-black tracking-[-0.06em]">
              dumel
              <span className="ml-1 text-xl font-normal tracking-normal">
                Dump
              </span>
            </h1>

            <p className="mt-1 rotate-[-1deg] text-sm font-bold uppercase tracking-wider">
              little thoughts. big mess.
            </p>
          </div>

          <Link href="/me" className="group relative block rotate-[3deg]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-dumel-yellow text-3xl font-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-2 transition-all">
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
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              Filter your chaos
            </p>

            <h2 className="mt-1 text-2xl font-black uppercase">Mood</h2>
          </div>

          <span className="rotate-[3deg] border-2 border-black bg-dumel-yellow px-3 py-1 text-xs font-black shadow-[3px_3px_0px_#000]">
            PICK ONE!
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-1 pb-3">
          <button
            type="button"
            onClick={() => setSelectedMood("ALL")}
            className={`
              shrink-0
              border-3
              border-black
              px-4
              py-2
              text-sm
              font-black
              uppercase
              transition-all
              ${
                selectedMood === "ALL"
                  ? "translate-x-[2px] translate-y-[2px] bg-black text-white shadow-none"
                  : "bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1"
              }
            `}
          >
            ALL
          </button>

          {Object.entries(moods).map(([value, emoji], index) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedMood(value)}
              className={`
                shrink-0
                flex
                items-center
                gap-2
                border-3
                border-black
                px-4
                py-2
                font-black
                shadow-[4px_4px_0px_#000]
                transition-all
                ${
                  selectedMood === value
                    ? "translate-x-[2px] translate-y-[2px] bg-dumel-yellow shadow-none"
                    : "bg-white hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000]"
                }
                ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}
              `}
            >
              <span className="text-2xl">{emoji}</span>

              <span className="text-xs">{value}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="flex flex-col gap-10">
        {postToDelete && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 px-5"
            onClick={cancelDeletePost}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-sm rotate-[-2deg] border-4 border-black bg-dumel-paper p-6 shadow-[9px_9px_0px_#000]"
            >
              <div className="absolute -right-4 -top-5 rotate-12 border-3 border-black bg-dumel-yellow px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000]">
                WAIT!
              </div>

              <h2 className="text-center text-4xl font-black uppercase tracking-tight">
                DELETE?!
              </h2>

              <div className="my-5 flex justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="h-2 w-2 rounded-full bg-black" />
              </div>

              <div className="rotate-[1deg] border-3 border-black bg-white p-4 text-center shadow-[4px_4px_0px_#000]">
                <p className="text-lg font-black">
                  Yakin mau menghapus Dumel ini?
                </p>

                <p className="mt-2 text-sm font-medium">
                  Setelah dihapus, Dumel ini tidak bisa dikembalikan.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={cancelDeletePost}
                  disabled={deletingPost}
                  className="flex-1 border-3 border-black bg-white px-4 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  NOPE!
                </button>

                <button
                  type="button"
                  onClick={confirmDeletePost}
                  disabled={deletingPost}
                  className="flex-1 border-3 border-black bg-red-400 px-4 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingPost ? "DELETING..." : "DELETE!"}
                </button>
              </div>

              <div className="absolute -bottom-5 left-12 h-8 w-8 rotate-45 border-b-4 border-r-4 border-black bg-dumel-paper" />
            </div>
          </div>
        )}

        {loadingPosts && encryptionKey && (
          <div className="rotate-[-1deg] border-3 border-black bg-white p-6 shadow-[5px_5px_0px_#000]">
            <p className="font-black uppercase">Loading your chaos...</p>
          </div>
        )}

        {error && (
          <div className="rotate-[1deg] border-3 border-black bg-red-300 p-5 shadow-[5px_5px_0px_#000]">
            <p className="font-black uppercase">Something went wrong!</p>

            <p className="mt-1 text-sm font-medium">{error}</p>
          </div>
        )}

        {!loadingPosts &&
          !error &&
          encryptionKey &&
          filteredPosts.length === 0 && (
            <div className="relative rotate-[-1deg] border-3 border-black bg-dumel-paper p-10 text-center shadow-[6px_6px_0px_#000]">
              <div className="absolute -top-4 left-1/2 h-7 w-20 -translate-x-1/2 rotate-[-3deg] border border-black bg-dumel-yellow" />

              <p className="text-5xl">
                {selectedMood === "ALL" ? "📭" : moods[selectedMood]}
              </p>

              <p className="mt-4 text-2xl font-black uppercase">
                {selectedMood === "ALL"
                  ? "Belum ada Dumel."
                  : `No ${selectedMood} Dumel!`}
              </p>

              <p className="mt-2 text-sm font-medium">
                {selectedMood === "ALL"
                  ? "Your brain is suspiciously quiet."
                  : "Maybe try another mood?"}
              </p>

              {selectedMood !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedMood("ALL")}
                  className="mt-5 border-3 border-black bg-dumel-yellow px-5 py-2 font-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  SHOW ALL
                </button>
              )}
            </div>
          )}

        {/* ================= POSTS ================= */}
        {!loadingPosts &&
          !error &&
          encryptionKey &&
          filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className={`
                relative
                border-3
                border-black
                bg-dumel-paper
                px-4
                pb-5
                pt-4
                shadow-[6px_6px_0px_#000]
                ${index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}
              `}
            >
              {/* TAPE */}
              <div className="absolute -top-3 left-1/2 h-7 w-20 -translate-x-1/2 rotate-[-2deg] border border-black bg-dumel-yellow/80" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white text-3xl shadow-[2px_2px_0px_#000]">
                    {moods[post.mood] || "🫤"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                      Mood dump
                    </p>

                    <h2 className="truncate text-xl font-black">
                      {post.title || "Untitled"}
                    </h2>
                  </div>
                </div>

                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleBtn(post.id)}
                    className="flex h-10 w-10 rotate-[3deg] items-center justify-center border-2 border-black bg-dumel-yellow text-xl font-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-1 hover:rotate-[-3deg] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    ...
                  </button>

                  {activeMenu === post.id && (
                    <div className="absolute right-0 top-12 z-50 w-36 rotate-[-2deg] border-3 border-black bg-white p-2 shadow-[5px_5px_0px_#000]">
                      <button
                        type="button"
                        onClick={() => handleEditPost(post.id)}
                        className="flex w-full items-center justify-between border-2 border-black bg-dumel-yellow px-3 py-2 font-black uppercase shadow-[2px_2px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000]"
                      >
                        <span>EDIT</span>
                        <span>✎</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        disabled={deletingPost}
                        className="mt-2 flex w-full items-center justify-between border-2 border-black bg-red-400 px-3 py-2 font-black uppercase shadow-[2px_2px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>{deletingPost ? "..." : "DELETE"}</span>

                        <span>✕</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {post.images.length > 0 && (
                <div className="mt-5 overflow-hidden border-3 border-black bg-white p-1">
                  <ImageStack
                    images={post.images.map((image) => image.imageUrl)}
                  />
                </div>
              )}

              <div className="relative mt-5 border-t-2 border-dashed border-black pt-4">
                <p className="whitespace-pre-wrap pl-1 text-[15px] font-medium leading-7 line-clamp-6">
                  {post.content}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t-2 border-black pt-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  #dumeldump
                </span>

                <span className="rotate-[2deg] border-2 border-black bg-white px-2 py-1 text-[10px] font-black">
                  {post.mood}
                </span>
              </div>
            </article>
          ))}
      </main>

      <Link
        href="/posts/create"
        className="group fixed bottom-5 right-5 z-[9999] flex h-16 w-16 rotate-[4deg] items-center justify-center border-3 border-black bg-dumel-yellow text-5xl font-black shadow-[5px_5px_0px_#000] transition-all hover:-translate-y-2 hover:rotate-[-4deg] hover:shadow-[7px_7px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <span className="transition-transform group-hover:rotate-90">+</span>
      </Link>
    </div>
  );
}
