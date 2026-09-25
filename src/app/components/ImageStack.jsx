"use client";

import { useState } from "react";

export default function ImageStack({ images, onRemove }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (images.length <= 1) {
      return;
    }
    console.log("gambar diklik", activeIndex);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleRemove = (event) => {
    console.log(`menghapus cuking ${activeIndex}`);
    event.stopPropagation();
    onRemove(activeIndex);
    setActiveIndex((prev) => {
      if (prev >= images.length - 1) {
        return Math.max(0, images.length - 2);
      }

      return prev;
    });
  };

  return (
    <div
      onClick={handleNext}
      className="relative w-full aspect-[4/3] cursor-pointer touch-manipulation"
    >
      {images.map((image, index) => {
        const position = (index - activeIndex + images.length) % images.length;

        if (position > 2) return null;

        const styles = [
          {
            translateY: 0,
            rotate: 0,
            scale: 1,
          },
          {
            translateY: 10,
            rotate: -3,
            scale: 0.96,
          },
          {
            translateY: 20,
            rotate: 4,
            scale: 0.92,
          },
        ];

        const style = styles[position];

        return (
          <div
            key={
              typeof image === "string"
                ? `image-${image}-${index}`
                : image.id
                  ? `db-${image.id}`
                  : `new-${image.imageUrl}`
            }
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl transition-all duration-500 ease-out"
            style={{
              zIndex: 30 - position,
              transform: `
                translateY(${style.translateY}px)
                rotate(${style.rotate}deg)
                scale(${style.scale})
              `,
            }}
          >
            {onRemove && position === 0 && (
              <button
                type="button"
                onClick={handleRemove}
                className="pointer-events-auto absolute right-3 top-3 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white"
              >
                x
              </button>
            )}
            <img
              src={typeof image === "string" ? image : image.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
