"use client";

import { useState } from "react";

export default function ImageStack({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    console.log("gambar diklik");
    setActiveIndex((prev) => (prev + 1) % images.length);
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
            key={image}
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
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        );
      })}
    </div>
  );
}
