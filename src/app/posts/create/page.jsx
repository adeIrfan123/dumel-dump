import React from "react";
import ImageStack from "../../components/ImageStack";
import Link from "next/link";

function CreatePost() {
  const images = [
    "/Cuking.jpg",
    "/Cuking2.jpg",
    "/Cuking3.jpg",
    "/Cuking4.jpg",
    "/Cuking5.jpg",
  ];
  return (
    <div className="shadow-[6px_6px_rgba(0,0,0,255)] bg-dumel-paper mt-4 relative">
      <h1 className="bg-pink-500 text-2xl font-bold -rotate-2 py-2 px-4 shadow shadow-[-6px_6px_rgba(0,0,0,255)] absolute -left-3">
        {"Create you'r Dumel"}
      </h1>

      <div className="flex justify-end px-8 pt-4 ">
        <Link href="/" className="text-3xl font-bold">
          X
        </Link>
      </div>

      <form action="" className="pt-8 px-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full border-2 py-2 px-4 rounded-lg placeholder:font-bold placeholder:text-xl "
          />
          <textarea
            type="text"
            placeholder="You'r Dumel"
            className="my-8 w-full h-80 border-2 py-2 px-4 rounded-lg placeholder:font-bold placeholder:text-xl"
          />

          <ImageStack images={images} />

          <div className="my-9">
            <input id="gambar" type="file" className="hidden" />
            <label
              htmlFor="gambar"
              className="inline-block cursor-pointer rounded-lg border-2 border-dumel-line bg-dumel-yellow px-5 py-3 font-bold text-dumel-ink transition hover:bg-dumel-yellow-dark"
            >
              📷 Tambahkan Gambar
            </label>
          </div>

          <div className="flex gap-3 text-3xl mt-5 mb-12">
            <p>🤩</p>
            <p>😡</p>
            <p>😢</p>
            <p>😆</p>
            <p>🫤</p>
          </div>

          <div className="flex justify-end mb-12">
            <button
              type="button"
              className="bg-dumel-yellow py-2 px-12 text-3xl font-bold rounded-lg border-2 shadow-[-6px_6px_rgba(0,0,0,255)] hover:bg-dumel-yellow-dark transition-all hover:-rotate-3 active:shadow-none active:translate-y-2"
            >
              Share
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
