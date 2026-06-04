import React, { useState } from "react";

export default function CardOfDestination() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    {
      src: "https://i.pinimg.com/1200x/cb/ce/7a/cbce7aa119accd980950e35ab6440fc4.jpg",
      quote: '"Innovate relentlessly. Stagnation is the enemy of progress."',
    },
    {
      src: "https://i.pinimg.com/736x/5e/46/d0/5e46d02b7fa9af52e6d750b19d274506.jpg",
      quote: '"Design is not just what it looks like, but how it works."',
    },
    {
      src: "https://i.pinimg.com/736x/06/f3/11/06f311a572b8b05150c9ba5d08e23a28.jpg",
      quote: '"Simplicity is the ultimate sophistication."',
    },
  ];

  return (
    <div className="relative z-10 flex h-[500px] w-full max-w-6xl gap-2 p-4 mx-auto">
      {images.map((img, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`relative h-full overflow-hidden rounded-xl transition-all duration-500 ease-in-out cursor-pointer
            ${
              hoveredIndex === null
                ? "flex-1"
                : hoveredIndex === index
                ? "flex-[2]"
                : "flex-1"
            }
          `}
        >
          {/* Image */}
          <img
            src={img.src}
            alt={`Gallery item ${index}`}
            className={`h-full w-full object-cover transition-all duration-700
              ${
                hoveredIndex !== null && hoveredIndex !== index
                  ? "blur-md scale-105"
                  : "blur-0 scale-100"
              }
            `}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 flex flex-col justify-end bg-black/40 p-6 transition-opacity duration-500
              ${hoveredIndex === index ? "opacity-100" : "opacity-0"}
            `}
          >
            <p className="text-white text-lg font-medium leading-tight drop-shadow-md">
              {img.quote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}