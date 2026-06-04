import Herosection from "../../components/Passenger/HerosectionVedio.jsx";
import RoundTrip from "../../components/Passenger/tripType";
import Footer from "../../components/Passenger/footer";
import CardOfDestination from "../../components/Passenger/cardofpopular.jsx";
import FlightOfferCard from "../../components/Passenger/flightdiscountoffer.jsx";

import WhyChooseUs from "./WHYCHOOSEUS.jsx";


export default function Home() {
    return (
    <div className="relative">

      {/* HERO VIDEO */}
      <Herosection />

      {/* SEARCH SECTION */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-7xl">
          <RoundTrip />
        </div>
      </div>

      {/* POPULAR DESTINATIONS */}
      <section className="relative z-10 bg-white py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <span className="text-blue-600 font-semibold uppercase tracking-[0.3em]">
              Explore The World
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Popular Destinations
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-5 rounded-full"></div>

            <p className="max-w-2xl mx-auto text-gray-500 mt-6 text-lg">
              Discover breathtaking destinations, vibrant cities, and
              unforgettable experiences chosen by thousands of travelers.
            </p>

          </div>

          <CardOfDestination />

        </div>

      </section>

      {/* OFFERS SECTION */}
      <section className="bg-slate-50 py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <span className="text-blue-600 font-semibold uppercase tracking-widest">
              Special Deals
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Latest Flight Offers
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-5 rounded-full"></div>

            <p className="text-gray-500 max-w-2xl mx-auto mt-6 text-lg">
              Discover exclusive flight discounts and limited-time travel deals
              to your favorite destinations around the world.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            <FlightOfferCard />
            <FlightOfferCard />
            <FlightOfferCard />

          </div>

        </div>

      </section>

     {/* WHY CHOOSE US */}
     <WhyChooseUs/>
      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-24 px-6">

        <div className="max-w-5xl mx-auto text-center text-white">

          <h2 className="text-4xl md:text-6xl font-bold">
            Ready For Your Next Adventure?
          </h2>

          <p className="mt-6 text-lg md:text-xl text-blue-100">
            Book your flight today and explore amazing destinations around
            the world.
          </p>

          <button className="mt-10 bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition">
            Start Booking Now
          </button>

        </div>
        
      </section>


      {/* FOOTER */}
      <Footer />

    </div>
  );
}