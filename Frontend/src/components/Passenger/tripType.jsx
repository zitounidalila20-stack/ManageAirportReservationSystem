import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Inputflied from "./inputflied.jsx";
import Datepicker from "./datepicker";
import Selectnumberofpassenger from "./SelectPassengerNumber";
import SelectClass from "./ClassSelection";

export default function FlightSearch() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("roundtrip");

  const [searchInformation, setSearchInformation] = useState({
    from: "",
    to: "",
    departDate: "",
    arrivalDate: "",
    legs: [{ from: "", to: "", date: "" }],
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabinClass: "Economy",
  });

  const updateField = (field, value) => {
    setSearchInformation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const swapLocations = () => {
    setSearchInformation((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = async () => {
    let payload;

    if (tripType === "oneway") {
      payload = {
        tripType,
        from: searchInformation.from,
        to: searchInformation.to,
        departDate: searchInformation.departDate,
        passengers: searchInformation.passengers,
        cabinClass: searchInformation.cabinClass,
      };
    } else if (tripType === "roundtrip") {
      payload = {
        tripType,
        from: searchInformation.from,
        to: searchInformation.to,
        departDate: searchInformation.departDate,
        arrivalDate: searchInformation.arrivalDate,
        passengers: searchInformation.passengers,
        cabinClass: searchInformation.cabinClass,
      };
    } else {
      payload = {
        tripType,
        legs: searchInformation.legs,
        passengers: searchInformation.passengers,
        cabinClass: searchInformation.cabinClass,
      };
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/search",
        payload
      );

      navigate("/searchresult", {
        state: {
          flights: res.data.flights,
          passengers: payload.passengers,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
 className="
    w-full
    max-w-7xl
    mx-auto

    bg-black/30
    backdrop-blur-2xl

    rounded-3xl

    border
    border-white/10

    shadow-[0_8px_32px_rgba(0,0,0,0.5)]

    p-5
    md:p-8

    text-white
  "
    >
      {/* TRIP TYPE */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { key: "oneway", label: "One Way" },
          { key: "roundtrip", label: "Round Trip" },
          { key: "multicity", label: "Multi City" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTripType(item.key)}
            className={`
              px-6
              py-3
              rounded-full
              font-medium
              transition-all
              duration-300

              ${
                tripType === item.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* PASSENGERS + CLASS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Selectnumberofpassenger
          value={searchInformation.passengers}
          onChange={(val) => updateField("passengers", val)}
        />

        <SelectClass
          value={searchInformation.cabinClass}
          onChange={(val) => updateField("cabinClass", val)}
        />
      </div>

      {/* ONE WAY */}
      {tripType === "oneway" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="relative">
            <Inputflied
              title="From"
              value={searchInformation.from}
              onChange={(val) => updateField("from", val)}
            />

          </div>

          <Inputflied
            title="To"
            value={searchInformation.to}
            onChange={(val) => updateField("to", val)}
          />

          <Datepicker
            title="Departure"
            value={searchInformation.departDate}
            onChange={(val) => updateField("departDate", val)}
          />
        </div>
      )}

      {/* ROUND TRIP */}
      {tripType === "roundtrip" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          <div className="relative">
            <Inputflied
              title="From"
              value={searchInformation.from}
              onChange={(val) => updateField("from", val)}
            />
          </div>

          <Inputflied
            title="To"
            value={searchInformation.to}
            onChange={(val) => updateField("to", val)}
          />

          <Datepicker
            title="Departure"
            value={searchInformation.departDate}
            onChange={(val) => updateField("departDate", val)}
          />

          <Datepicker
            title="Return"
            value={searchInformation.arrivalDate}
            onChange={(val) => updateField("arrivalDate", val)}
          />
        </div>
      )}

      {/* MULTI CITY */}
      {tripType === "multicity" && (
        <div className="space-y-4 mb-8">
          {searchInformation.legs.map((leg, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Inputflied
                title="From"
                value={leg.from}
                onChange={(value) => {
                  const updated = [...searchInformation.legs];
                  updated[index].from = value;
                  updateField("legs", updated);
                }}
              />

              <Inputflied
                title="To"
                value={leg.to}
                onChange={(value) => {
                  const updated = [...searchInformation.legs];
                  updated[index].to = value;
                  updateField("legs", updated);
                }}
              />

              <Datepicker
                title="Date"
                value={leg.date}
                onChange={(value) => {
                  const updated = [...searchInformation.legs];
                  updated[index].date = value;
                  updateField("legs", updated);
                }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              updateField("legs", [
                ...searchInformation.legs,
                { from: "", to: "", date: "" },
              ])
            }
            className="
              px-5
              py-3
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              transition
            "
          >
            + Add Another Flight
          </button>
        </div>
      )}

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSubmit}
        className="
          w-full
          h-14
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          text-lg
          font-semibold
          shadow-lg
          hover:shadow-xl
          hover:scale-[1.01]
          transition-all
          duration-300
        "
      >
        Search Flights ✈️
      </button>
    </div>
  );
}