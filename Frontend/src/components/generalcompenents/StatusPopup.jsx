export default function StatusPopup({
  type = "success",
  title,
  message,
  buttonText = "OK",
  onClick,
}) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dark background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClick}
      />
      {/* POPUP */}
      <div
        className={`relative w-80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-6 animate-fadeIn
        ${
          isSuccess
            ? "bg-gradient-to-br from-lime-400 to-emerald-300"
            : "bg-gradient-to-bl from-pink-400 to-orange-300"
        }`}
      >
        {/* top dots */}
        <div className="flex gap-2 self-end">
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
        </div>

        {/* face icon */}
        <div className="relative w-16 h-16 bg-white rounded-full border border-gray-400 mt-2">
          <div className="absolute top-6 left-3 w-1.5 h-1.5 bg-gray-600 rounded-full" />
          <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-gray-600 rounded-full" />

          {isSuccess ? (
            <div className="absolute left-1/2 top-8 w-3 h-3 border-b-2 border-r-2 border-gray-600 rotate-45 -translate-x-1/2" />
          ) : (
            <div className="absolute left-1/2 top-8 w-3 h-3 border-t-2 border-l-2 border-gray-600 rotate-45 -translate-x-1/2" />
          )}
        </div>

        {/* TEXT */}
        <div className="text-center mt-5 space-y-2">
          <h2 className="text-white font-bold tracking-[4px] text-lg">
            {title}
          </h2>

          <p className="text-gray-700 text-sm break-words">
            {message}
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={onClick}
          className="mt-6 w-40 h-11 bg-white rounded-full shadow-md hover:scale-105 transition"
        >
          <span
            className={`font-semibold uppercase tracking-wider ${
              isSuccess ? "text-green-700" : "text-red-600"
            }`}
          >
            {buttonText}
          </span>
        </button>
      </div>
    </div>
  );
}