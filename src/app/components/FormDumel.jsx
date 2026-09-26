"use client";

import { useState } from "react";
import ImageStack from "./ImageStack";

const moods = [
  { value: "HAPPY", emoji: "🤩" },
  { value: "ANGRY", emoji: "😡" },
  { value: "SAD", emoji: "😢" },
  { value: "LAUGHING", emoji: "😆" },
  { value: "CONFUSED", emoji: "🫤" },
];

function FormDumel({
  initialData = {
    title: "",
    content: "",
    mood: "",
    images: [],
  },
  onSubmit,
  submitText = "POST",
  loading = false,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [mood, setMood] = useState(initialData.mood || "");

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState(initialData.images || []);
  const [deletedImages, setDeletedImages] = useState([]);

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    mood: "",
  });

  const handleTitleInput = (event) => {
    setTitle(event.target.value);

    setErrors((prev) => ({
      ...prev,
      title: "",
    }));
  };

  const handleContentInput = (event) => {
    setContent(event.target.value);

    setErrors((prev) => ({
      ...prev,
      content: "",
    }));
    loading;
  };

  const handleUploadImage = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    const newImages = selectedFiles.map((file) => ({
      id: null,
      imageUrl: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...selectedFiles]);
    setImages((prev) => [...prev, ...newImages]);

    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];

    if (!imageToRemove) return;

    if (imageToRemove.id) {
      setDeletedImages((prev) => [...prev, imageToRemove.id]);
    }

    if (imageToRemove.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.imageUrl);

      const blobImages = images.filter((image) =>
        image.imageUrl.startsWith("blob:"),
      );

      const blobIndex = blobImages.findIndex(
        (image) => image.imageUrl === imageToRemove.imageUrl,
      );

      setFiles((prev) =>
        prev.filter((_, fileIndex) => fileIndex !== blobIndex),
      );
    }

    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleMoodClick = (value) => {
    setMood(value);

    setErrors((prev) => ({
      ...prev,
      mood: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrors((prev) => ({
        ...prev,
        title: "Title Required",
      }));
      return;
    }

    if (!content.trim()) {
      setErrors((prev) => ({
        ...prev,
        content: "Content Required",
      }));
      return;
    }

    if (!mood) {
      setErrors((prev) => ({
        ...prev,
        mood: "So, what's the mood doing today?",
      }));
      return;
    }

    await onSubmit({
      title,
      content,
      mood,
      files,
      images,
      deletedImages,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={loading}
      className="mx-auto w-full max-w-2xl px-5 pb-12 pt-8"
    >
      <div className="rotate-[-1deg] border-4 border-black bg-white p-5 shadow-[8px_8px_0px_#000] sm:p-7">
        <div className="mb-7 border-b-3 border-black pb-5">
          <p className="mb-2 inline-block rotate-[2deg] border-2 border-black bg-dumel-yellow px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#000]">
            DUMEL TIME!
          </p>

          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Write Your Dumel
          </h1>

          <p className="mt-1 text-sm font-bold text-gray-600">
            Spill whatever is inside your head.
          </p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-black uppercase"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="What's on your mind?"
            maxLength={100}
            value={title}
            onChange={handleTitleInput}
            disabled={loading}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            className="w-full border-3 border-black bg-dumel-paper px-4 py-3 text-lg font-bold outline-none transition-all placeholder:font-bold placeholder:text-gray-500 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.title && (
            <p
              id="title-error"
              className="mt-2 pl-2 text-sm font-black text-red-500"
            >
              ⚠️ {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="mb-7">
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-black uppercase"
          >
            Your Dumel
          </label>

          <textarea
            id="content"
            placeholder="Tell me everything..."
            value={content}
            onChange={handleContentInput}
            disabled={loading}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? "content-error" : undefined}
            className="min-h-72 w-full resize-y border-3 border-black bg-dumel-paper px-4 py-3 text-base font-bold leading-relaxed outline-none transition-all placeholder:font-bold placeholder:text-gray-500 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.content && (
            <p
              id="content-error"
              className="mt-2 pl-2 text-sm font-black text-red-500"
            >
              ⚠️ {errors.content}
            </p>
          )}
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black uppercase">Your Pictures</p>

              <span className="border-2 border-black bg-dumel-yellow px-2 py-1 text-xs font-black shadow-[2px_2px_0px_#000]">
                {images.length} PIC{images.length > 1 ? "S" : ""}
              </span>
            </div>

            <ImageStack images={images} onRemove={handleRemoveImage} />
          </div>
        )}

        {/* Upload */}
        <div className="mb-8">
          <input
            id="gambar"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadImage}
            disabled={loading}
            className="hidden"
          />

          <label
            htmlFor="gambar"
            className="inline-flex cursor-pointer items-center gap-2 border-3 border-black bg-white px-4 py-3 font-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:bg-dumel-yellow hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            📷
            <span>ADD PICTURES</span>
          </label>

          <p className="mt-2 pl-1 text-xs font-bold text-gray-500">
            You can add multiple pictures.
          </p>
        </div>

        {/* Mood */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase">
                {"What's the mood?"}
              </p>

              <p className="text-xs font-bold text-gray-500">
                Pick one. No pressure.
              </p>
            </div>

            <span className="rotate-3 text-2xl">💭</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {moods.map((item, index) => {
              const selected = mood === item.value;

              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleMoodClick(item.value)}
                  disabled={loading}
                  aria-label={`Mood ${item.value.toLowerCase()}`}
                  aria-pressed={selected}
                  className={`
                    flex items-center gap-2
                    border-3 border-black
                    px-3 py-2
                    font-black
                    shadow-[3px_3px_0px_#000]
                    transition-all
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      selected
                        ? "translate-x-[2px] translate-y-[2px] bg-dumel-yellow shadow-none"
                        : "bg-white hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000]"
                    }
                    ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}
                  `}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs">{item.value}</span>
                </button>
              );
            })}
          </div>

          {errors.mood && (
            <p
              id="mood-error"
              className="mt-3 pl-2 text-sm font-black text-red-500"
            >
              ⚠️ {errors.mood}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="border-t-3 border-black pt-6">
          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            className="w-full border-3 border-black bg-dumel-yellow px-6 py-3 text-xl font-black uppercase shadow-[5px_5px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "SAVING..." : `${submitText} →`}
          </button>

          {loading && (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 text-center text-sm font-black"
            >
              Saving your Dumel...
            </p>
          )}
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="mt-8 flex justify-center gap-2">
        <span className="h-3 w-3 rotate-12 border-2 border-black bg-dumel-yellow" />
        <span className="h-3 w-3 -rotate-12 border-2 border-black bg-white" />
        <span className="h-3 w-3 rotate-12 border-2 border-black bg-dumel-yellow" />
      </div>
    </form>
  );
}

export default FormDumel;
