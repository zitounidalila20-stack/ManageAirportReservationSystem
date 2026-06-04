import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {Bell,CircleUser,Languages} from "lucide-react";


export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Flight Status", to: "/flightStatus" },
    { name: "Offers", to: "#" },
  ];

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth(); // initial check

    // when token changes in same tab
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50">

      <div className="backdrop-blur-2xl bg-black/30 border-b border-white/10 shadow-lg">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
{/* LOGO */}
{/* LOGO */}
<Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
    ✈️
  </div>

  <h1 className="font-bold text-xl text-white">
    NodeAir
  </h1>
</Link>
            {/* LINKS */}
            <div className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* AUTH / USER AREA */}
            <div className="hidden md:flex gap-3 items-center">

              {!isLoggedIn ? (
                <>
                  <Link to="/auth">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
                      Login
                    </button>
                  </Link>

                  <Link to="/auth">
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <>


<Link to="/notifications" onClick={closeMenu}>
  <Bell className="text-white text-xl"/>
</Link>
<button className="text-white text-xl">
  <CircleUser />
</button>

<button className="text-white text-xl">
  <Languages />
</button>
                  <button onClick={() => {localStorage.removeItem("token");setIsLoggedIn(false);}}
                  className="ml-2 px-4 py-1.5 rounded-xl bg-white/5 border border-red-400/30 text-red-400
                   hover:bg-red-500/10 hover:border-red-400 transition duration-200 backdrop-blur-md">Logout</button>
                </>
              )}

            </div>

            {/* MOBILE */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white text-2xl"
            >
              {open ? "✕" : "☰"}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
{/* MOBILE MENU */}
{open && (
  <div className="md:hidden px-4 pb-4 space-y-4">

    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.to}
        onClick={closeMenu}
        className="block text-white/70 hover:text-white"
      >
        {link.name}
      </Link>
    ))}

    {!isLoggedIn ? (
      <div className="flex flex-col gap-2 pt-2">
        <Link to="/auth" onClick={closeMenu}>
          <button className="w-full py-2 bg-white/5 text-white rounded">
            Login
          </button>
        </Link>

        <Link to="/auth" onClick={closeMenu}>
          <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded">
            Sign up
          </button>
        </Link>
      </div>
    ) : (
      <div className="flex gap-5 pt-2 text-white text-xl items-center">

        {/* ✅ NOTIFICATION */}
        <Link to="/notifications" onClick={closeMenu}>
          <Bell />
        </Link>

        <CircleUser />
        <Languages />

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            closeMenu();
          }}
          className="ml-2 px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-400/30"
        >
          Logout
        </button>

      </div>
    )}

  </div>
)}

      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </nav>
  );
}