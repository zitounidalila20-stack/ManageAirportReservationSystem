import React, { useState } from "react";

export default function FlightOfferCard({
  from = "Cairo (CAI)",
  to = "Riyadh (RUH)",
  image = "https://i.pinimg.com/1200x/cb/ce/7a/cbce7aa119accd980950e35ab6440fc4.jpg",
  date = "Sun 17 May",
  type = "Direct",
  price = 11683,
  currency = "دج",
  discount = 16,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-[320px] w-full max-w-sm overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-500"
    >

      {/* IMAGE */}
      <img
        src={image}
        className={`h-full w-full object-cover transition-all duration-700 ${
          hovered ? "scale-110 blur-sm" : "scale-100"
        }`}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* DISCOUNT BADGE */}
      <div className="absolute top-3 right-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        ↓ {discount}%
      </div>

      {/* CONTENT */}
      <div
        className={`absolute bottom-0 left-0 w-full p-5 text-white transition-all duration-500 ${
          hovered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-90"
        }`}
      >

        {/* FROM → TO */}
        <p className="text-sm text-gray-200">From {from}</p>
        <h2 className="text-xl font-bold">{to}</h2>

        {/* DETAILS */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-200">
          <span>{date}</span>
          <span>•</span>
          <span>{type}</span>
        </div>

        {/* PRICE */}
        <div className="mt-3 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-300 uppercase">Start from</p>
            <p className="text-2xl font-bold text-red-400">
              {price.toLocaleString()} {currency}
            </p>
          </div>

          <button className="bg-white text-black text-xs px-4 py-2 rounded-full hover:scale-105 transition">
            Book
          </button>
        </div>

      </div>
    </div>
  );
}