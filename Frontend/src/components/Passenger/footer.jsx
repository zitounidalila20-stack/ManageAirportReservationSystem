export default function Footer() {
  return (
    <footer className="bg-black/80 text-white px-10 py-16 mt-20 backdrop-blur-md">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* 🛫 BRAND */}
        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              ✈️
            </div>
            <h2 className="text-xl font-bold">NodeAir</h2>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Book flights easily and explore the world with the best prices and fastest search experience.
          </p>
        </aside>

        {/* SERVICES */}
        <nav className="flex flex-col space-y-3">
          <h6 className="text-lg font-semibold">Services</h6>

          <a className="text-gray-400 hover:text-white transition">Flight Booking</a>
          <a className="text-gray-400 hover:text-white transition">Hotel Search</a>
          <a className="text-gray-400 hover:text-white transition">Car Rental</a>
          <a className="text-gray-400 hover:text-white transition">Travel Deals</a>
        </nav>

        {/* COMPANY */}
        <nav className="flex flex-col space-y-3">
          <h6 className="text-lg font-semibold">Company</h6>

          <a className="text-gray-400 hover:text-white transition">About Us</a>
          <a className="text-gray-400 hover:text-white transition">Contact</a>
          <a className="text-gray-400 hover:text-white transition">Careers</a>
          <a className="text-gray-400 hover:text-white transition">Press</a>
        </nav>

        {/* LEGAL */}
        <nav className="flex flex-col space-y-3">
          <h6 className="text-lg font-semibold">Legal</h6>

          <a className="text-gray-400 hover:text-white transition">Terms of Use</a>
          <a className="text-gray-400 hover:text-white transition">Privacy Policy</a>
          <a className="text-gray-400 hover:text-white transition">Cookies Policy</a>
        </nav>

      </div>

      {/* 🔻 BOTTOM LINE */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NodeAir. All rights reserved.
      </div>

    </footer>
  );
}