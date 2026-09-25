"use client";

import React, { useEffect, useState } from "react";
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
  submitText = "Post",
  loading = false,
  //   errors = {},
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
    const titleValue = event.target.value;

    setErrors((prev) => ({
      ...prev,
      title: "",
    }));

    setTitle(titleValue);
  };

  const handleContentInput = (event) => {
    const contentValue = event.target.value;

    setErrors((prev) => ({
      ...prev,
      content: "",
    }));

    setContent(contentValue);
  };

  const handleUploadImage = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

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

    if (!imageToRemove) {
      return;
    }

    if (imageToRemove.id) {
      setDeletedImages((prev) => [...prev, imageToRemove.id]);
    }

    if (imageToRemove.imageUrl.startsWith("blob")) {
      URL.revokeObjectURL(imageToRemove.imageUrl);

      const blobImages = images.filter((image) => {
        return image.imageUrl.startsWith("blob:");
      });

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
    setErrors((prev) => ({
      ...prev,
      mood: "",
    }));

    setMood(value);
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
    <form action="" onSubmit={handleSubmit} className="pt-8 px-4">
      <div>
        <div>
          <input
            type="text"
            placeholder="Title"
            maxLength={100}
            value={title}
            onChange={handleTitleInput}
            className="w-full border-2 py-2 px-4 rounded-lg placeholder:font-bold placeholder:text-xl "
          />

          {errors && (
            <p className="font-bold text-red-500 pl-5 text-lg">
              {errors.title}
            </p>
          )}
        </div>

        <div className="my-8">
          <textarea
            type="text"
            placeholder="You'r Dumel"
            value={content}
            onChange={handleContentInput}
            className="w-full h-80 border-2 py-2 px-4 rounded-lg placeholder:font-bold placeholder:text-xl"
          />

          {errors && (
            <p className="font-bold text-red-500 pl-5 text-lg">
              {errors.content}
            </p>
          )}
        </div>

        {images.length > 0 && (
          <ImageStack images={images} onRemove={handleRemoveImage} />
        )}

        <div className="mb-12">
          <div className="my-9">
            <input
              id="gambar"
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadImage}
              className="hidden"
            />
            <label
              htmlFor="gambar"
              className="inline-block cursor-pointer rounded-lg border-2 border-dumel-line bg-dumel-yellow px-5 py-3 font-bold text-dumel-ink transition hover:bg-dumel-yellow-dark"
            >
              📷 Tambahkan Gambar
            </label>
          </div>

          <div className="flex gap-3 text-3xl mt-5 mb-5">
            {moods.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => handleMoodClick(item.value)}
                className={`transition-transform ${mood === item.value ? "scale-125" : "scale-100"}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
          {errors && (
            <p className="font-bold text-red-500 pl-5 text-lg">{errors.mood}</p>
          )}
        </div>

        <div className="flex justify-end mb-12">
          <button
            type="submit"
            className="bg-dumel-yellow py-2 px-12 text-3xl font-bold rounded-lg border-2 shadow-[-6px_6px_rgba(0,0,0,255)] hover:bg-dumel-yellow-dark transition-all hover:-rotate-3 active:shadow-none active:translate-y-2"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormDumel;
