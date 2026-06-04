export default function WhyChooseUs() {
  return (
    <section className="relative py-28 px-6 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">

      {/* background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">

        {/* HEADER */}
        <div className="text-center mb-20">

          <span className="text-blue-600 font-semibold tracking-[0.35em] uppercase">
            Premium Experience
          </span>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mt-6">
            Why Choose Us
          </h2>

          <div className="w-28 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-6 rounded-full"></div>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="group relative">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition"></div>

            <div className="relative p-10 rounded-[40px] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl hover:shadow-2xl transition duration-500 hover:-translate-y-2">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg mb-6"></div>

              <h3 className="text-2xl font-bold text-gray-900">
                Best Flight Deals
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Compare hundreds of airlines and find the most affordable and premium flight options worldwide.
              </p>

            </div>
          </div>

          {/* CARD 2 */}
          <div className="group relative">

            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition"></div>

            <div className="relative p-10 rounded-[40px] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl hover:shadow-2xl transition duration-500 hover:-translate-y-2">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg mb-6"></div>

              <h3 className="text-2xl font-bold text-gray-900">
                Secure Booking
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Advanced encryption ensures your data and payments are fully protected at every step.
              </p>

            </div>
          </div>

          {/* CARD 3 */}
          <div className="group relative">

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition"></div>

            <div className="relative p-10 rounded-[40px] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl hover:shadow-2xl transition duration-500 hover:-translate-y-2">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 shadow-lg mb-6"></div>

              <h3 className="text-2xl font-bold text-gray-900">
                24/7 Support
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Dedicated support team available anytime to assist you during your travel journey.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}