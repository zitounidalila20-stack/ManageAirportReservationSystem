import { Plane, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wider">
          SKYPORT
        </h1>

        <div className="flex gap-8 text-gray-300">
          <a href="#features">Features</a>
          <a href="#roles">Roles</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition">
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">

        {/* Background Glow */}
        <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full"></div>

        <div className="relative z-10 max-w-5xl">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full mb-8">
            <Plane size={16} />
            Smart Airport Management Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Elevating
            <span className="text-blue-500"> Airport </span>
            Operations
          </h1>

          <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
            A complete platform connecting passengers,
            airport staff, and administrators through
            intelligent flight management, real-time
            operations, and seamless booking experiences.
          </p>

          <div className="flex justify-center gap-5 mt-10">
            <button className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2">
              Book a Flight
              <ArrowRight size={18} />
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition">
              Learn More
            </button>
          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-6">

          {[
            ["10K+", "Passengers"],
            ["500+", "Flights"],
            ["50+", "Airlines"],
            ["99.9%", "Availability"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
            >
              <h2 className="text-4xl font-bold text-blue-400">
                {number}
              </h2>

              <p className="text-gray-400 mt-2">
                {label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <h2 className="text-5xl font-bold text-center mb-16">
          Built For Everyone
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition">
            <h3 className="text-2xl font-bold mb-5">
              Passenger
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>✓ Search Flights</li>
              <li>✓ Book Tickets</li>
              <li>✓ Select Seats</li>
              <li>✓ Download E-Tickets</li>
              <li>✓ Track Flights</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition">
            <h3 className="text-2xl font-bold mb-5">
              Airport Staff
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>✓ Assign Gates</li>
              <li>✓ Assign Runways</li>
              <li>✓ Monitor Flights</li>
              <li>✓ Manage Operations</li>
              <li>✓ Update Flight Status</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition">
            <h3 className="text-2xl font-bold mb-5">
              Administrator
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>✓ Manage Users</li>
              <li>✓ Manage Airlines</li>
              <li>✓ Generate Reports</li>
              <li>✓ Monitor Activity</li>
              <li>✓ System Configuration</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <h2 className="text-5xl font-bold text-center mb-16">
          Platform Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "Flight Management",
            "Gate Assignment",
            "Runway Allocation",
            "Real-Time Monitoring",
            "E-Ticket Generation",
            "Analytics Dashboard",
          ].map((feature) => (
            <div
              key={feature}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-xl font-semibold">
                {feature}
              </h3>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[40px] p-16">

          <h2 className="text-5xl font-bold">
            Ready To Fly Smarter?
          </h2>

          <p className="mt-5 text-lg text-blue-100">
            Join a modern airport management ecosystem
            designed for passengers, staff, and administrators.
          </p>

          <button className="mt-8 px-8 py-4 bg-white text-black rounded-2xl font-semibold">
            Get Started
          </button>

        </div>
      </section>

    </div>
  );
}