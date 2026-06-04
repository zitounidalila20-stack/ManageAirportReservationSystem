import React from 'react';
import { Plus } from 'lucide-react'; 

export default function FloatingActionButton() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.9)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Add item"
      >
        <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
      </button>
    </div>
  );
}