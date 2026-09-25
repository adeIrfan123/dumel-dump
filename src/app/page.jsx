"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./provider/AuthProvider";
import { decryptText } from "./lib/encryption";
import ImageStack from "./components/ImageStack";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { encryptionKey, loading } = useAuth();

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

            return {
              ...post,
              title: decryptedTitle,
              content: decryptedContent,
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

  return (
    <div className="relative pb-30">
      <header className="flex justify-between">
        <h1 className="text-4xl flex items-start font-bold">
          dumel<span className="text-xl font-thin">Dump</span>
        </h1>

        <div>
          <Image
            src="/Cuking.jpg"
            width={50}
            height={50}
            alt="Profil Image"
            className="rounded-full"
          />
        </div>
      </header>

      <div className="mt-5 mb-12">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xl font-black uppercase">Mood Filter</p>

          <span className="rotate-2 border-2 border-black bg-dumel-yellow px-2 py-1 text-xs font-black shadow-[2px_2px_0px_#000]">
            PICK ONE!
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => setSelectedMood("ALL")}
            className={`shrink-0 border-3 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_#000] transition-all ${selectedMood === "ALL" ? "translate-x-[2px] translate-y-[2px] bg-black text-white shadow-none" : "bg-white hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000]"} `}
          >
            ALL
          </button>

          {Object.entries(moods).map(([value, emoji], index) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedMood(value)}
              className={`shrink-0 flex items-center gap-2 border-3 border-black px-4 py-2 font-black shadow-[4px_4px_0px_#000] transition-all ${selectedMood === value ? "translate-x-[2px] translate-y-[2px] bg-dumel-yellow shadow-none" : "bg-white hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000]"} ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"} `}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm">{value}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex flex-col gap-8">
        {postToDelete && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-5"
            onClick={cancelDeletePost}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-sm rotate-[-2deg] border-4 border-black bg-dumel-paper p-6 shadow-[8px_8px_0px_#000]"
            >
              <div className="absolute -right-4 -top-5 rotate-12 border-3 border-black bg-dumel-yellow px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000]">
                WAIT!
              </div>

              <h2 className="text-center text-3xl font-black uppercase tracking-tight">
                DELETE?!
              </h2>

              <div className="my-4 flex justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="h-2 w-2 rounded-full bg-black" />
              </div>

              <div className="rotate-[1deg] border-3 border-black bg-white p-4 text-center shadow-[4px_4px_0px_#000]">
                <p className="text-lg font-bold">
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
                  className="flex-1 border-3 border-black bg-white px-4 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  NOPE!
                </button>

                <button
                  type="button"
                  onClick={confirmDeletePost}
                  disabled={deletingPost}
                  className="flex-1 border-3 border-black bg-red-400 px-4 py-3 font-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {deletingPost ? "DELETING..." : "DELETE!"}
                </button>
              </div>

              <div className="absolute -bottom-5 left-12 h-8 w-8 rotate-45 border-b-4 border-r-4 border-black bg-dumel-paper" />
            </div>
          </div>
        )}

        {loading && <p className="font-bold text-lg">Loading...</p>}

        {!loading && !encryptionKey && (
          <p className="font-bold text-red-500 text-lg">
            Encryption key belum tersedia.
          </p>
        )}

        {!loading && encryptionKey && loadingPosts && (
          <p className="font-bold text-lg">Loading posts...</p>
        )}

        {!loading && error && (
          <p className="font-bold text-red-500 text-lg">{error}</p>
        )}

        {!loading &&
          encryptionKey &&
          !loadingPosts &&
          !error &&
          filteredPosts.length === 0 && (
            <div className="rotate-[-1deg] border-3 border-black bg-white p-6 text-center shadow-[5px_5px_0px_#000]">
              <p className="text-4xl">
                {selectedMood === "ALL" ? "📭" : moods[selectedMood]}
              </p>

              <p className="mt-2 text-xl font-black uppercase">
                {selectedMood === "ALL"
                  ? "Belum ada Dumel."
                  : `No ${selectedMood} Dumel!`}
              </p>

              {selectedMood !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedMood("ALL")}
                  className="mt-4 border-2 border-black bg-dumel-yellow px-4 py-2 font-black shadow-[3px_3px_0px_#000]hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
                >
                  SHOW ALL
                </button>
              )}
            </div>
          )}

        {!loading &&
          encryptionKey &&
          !loadingPosts &&
          !error &&
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-dumel-paper rounded-lg px-2">
              <div className="flex justify-between pt-3">
                <div className="flex items-center gap-3">
                  <p className="text-4xl">{moods[post.mood] || "🫤"}</p>

                  <h2 className="font-bold text-lg">
                    {post.title || "Untitled"}
                  </h2>
                </div>

                <div className="relative pr-6">
                  <button
                    type="button"
                    onClick={() => handleToggleBtn(post.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-dumel-yellow text-xl font-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                  >
                    ...
                  </button>

                  {activeMenu === post.id && (
                    <div className="absolute right-0 top-12 z-50 w-36 rotate-[-2deg] border-3 border-black bg-white p-2 shadow-[5px_5px_0px_#000] ">
                      <button
                        type="button"
                        onClick={() => handleEditPost(post.id)}
                        className="flex w-full items-center justify-between border-2 border-black bg-dumel-yellow px-3 py-2 font-black uppercase tracking-wide shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer "
                      >
                        <span>EDIT</span>
                        <span>✎</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        disabled={deletingPost}
                        className="mt-2 flex w-full items-center justify-between border-2 border-black bg-red-400 px-3 py-2 font-black uppercase tracking-wide shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        <span>{deletingPost ? "..." : "DELETE"}</span>

                        <span>✕</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {post.images.length > 0 && (
                <div className="mt-3">
                  <ImageStack
                    images={post.images.map((image) => image.imageUrl)}
                  />
                </div>
              )}

              <div className="mt-6 pb-4">
                <p className="pl-2 line-clamp-6">{post.content}</p>
              </div>
            </div>
          ))}
      </main>

      <div className="w-[60px] h-[60px] text-center items-center flex justify-center z-[9999] fixed bottom-4 right-5 bg-dumel-yellow rounded-full">
        <Link href="/posts/create" className="text-5xl">
          +
        </Link>
      </div>
    </div>
  );
}
