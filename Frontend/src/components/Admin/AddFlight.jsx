import React, { useState , useEffect } from "react";
import axios from "axios";

import {Plane,MapPin,DollarSign,Send} from "lucide-react";
import DatePicker from "../Passenger/datepicker";
// =====================================
// FLOATING INPUT COMPONENT
// =====================================
const FloatingInput = ({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="relative">

      {/* ICON */}
      {Icon && (
        <Icon
          className={`
            absolute left-4 top-5 h-4 w-4 z-10
            ${error ? "text-red-500" : "text-slate-400"}
          `}
        />
      )}

      {/* INPUT */}
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        className={`
          peer w-full
          ${Icon ? "pl-11" : "pl-4"}
          pr-4 pt-6 pb-2
          bg-slate-50
          border
          ${error ? "border-red-500" : "border-slate-200"}
          rounded-xl
          outline-none
          transition-all duration-300

          focus:ring-2
          ${error ? "focus:ring-red-500" : "focus:ring-indigo-500"}

          focus:border-transparent
        `}
      />

      {/* LABEL */}
      <label
        htmlFor={id}
        className={`
          absolute
          ${Icon ? "left-11" : "left-4"}

          top-4
          ${error ? "text-red-500" : "text-slate-500"}

          transition-all duration-200
          pointer-events-none

          peer-focus:top-2
          peer-focus:text-xs
          ${error ? "peer-focus:text-red-500" : "peer-focus:text-indigo-600"}

          peer-placeholder-shown:top-4
          peer-placeholder-shown:text-base

          peer-not-placeholder-shown:top-2
          peer-not-placeholder-shown:text-xs
        `}
      >
        {label}
      </label>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </p>
      )}

    </div>
  );
};


// =====================================
// MAIN COMPONENT
// =====================================
export default function AddFlight(){
const [flightData, setFlightData] = useState({
  airline: "",
  flightNumber: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
  departureTime: "",
  arrivalTime: "",
  price: "",
   totalSeats: ""
});

const [airlines, setAirlines] = useState([]);

  const [errors, setErrors] = useState({});

  function validateField(name, value) {

    if (!value.trim()) {

      setErrors((prev) => ({
        ...prev,
        [name]: "This field is required",
      }));

    } else {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
Object.keys(flightData).forEach((key) => {
  if (!flightData[key]) {
    newErrors[key] = "This field is required";
  }
});

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log("DATA SENT:", flightData);

    try {
      const response = await axios.post("http://localhost:5000/addflight",flightData);
      console.log(flightData);
      console.log(response.data);
      alert("Flight Added Successfully");

    } catch (error) {
      console.log(error);
      alert("Error While Adding Flight");

    }
  }
useEffect(() => {
  fetchAirlines();
}, []);

const fetchAirlines = async () => {
  try {
    const response = await axios.get("http://localhost:5000/airlines");
    setAirlines(response.data);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <section className="min-h-screen bg-slate-50 py-12 px-4">

      <div className="max-w-4xl mx-auto">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">

          {/* HEADER */}
          <div className="bg-indigo-600 px-8 py-10 text-white relative overflow-hidden">

            <div className="relative z-10">

              <h3 className="text-3xl font-bold">
                Register New Flight
              </h3>

              <p className="text-indigo-100 mt-2 opacity-90">
                Fill in the details to add a new schedule to the fleet.
              </p>

            </div>

            <Plane className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500 opacity-20 -rotate-12" />

          </div>



          {/* FORM */}
          <div className="p-8 lg:p-12">

            <form
              className="space-y-10"
              onSubmit={handleSubmit}
            >

              {/* ===================================== */}
              {/* ROUTE SECTION */}
              {/* ===================================== */}
              <div>

                <div className="flex items-center gap-2 mb-6">

                  <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>

                  <h6 className="text-slate-800 text-sm font-bold uppercase tracking-wider">
                    Route Information
                  </h6>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* AIRLINE */}
<div>

  <select
    value={flightData.airline}
    onChange={(e) => {
      setFlightData({
        ...flightData,
        airline: e.target.value,
      });

      validateField("airline", e.target.value);
    }}
    className="w-full px-4 py-4 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
    <option value="">Select Airline</option>

{airlines.map((airline) => (
  <option
    key={airline.airportID}
    value={airline.name}
  >
    {airline.name}
  </option>
))}
  </select>

  {errors.airline && (
    <p className="text-red-500 text-sm mt-1">
      {errors.airline}
    </p>
  )}
</div>


                  {/* FLIGHT NUMBER */}
                  <FloatingInput
                    id="flightNumber"
                    label="Flight Number"
                    value={flightData.flightNumber}
                    error={errors.flightNumber}
                    onChange={(e) => {

                      setFlightData({
                        ...flightData,
                        flightNumber: e.target.value,
                      });

                      validateField("flightNumber", e.target.value);
                    }}
                  />


                  {/* ORIGIN */}
                  <FloatingInput
                    id="origin"
                    label="Origin"
                    icon={MapPin}
                    value={flightData.origin}
                    error={errors.origin}
                    onChange={(e) => {

                      setFlightData({
                        ...flightData,
                        origin: e.target.value,
                      });

                      validateField("origin", e.target.value);
                    }}
                  />


                  {/* DESTINATION */}
                  <FloatingInput
                    id="destination"
                    label="Destination"
                    icon={MapPin}
                    value={flightData.destination}
                    error={errors.destination}
                    onChange={(e) => {

                      setFlightData({
                        ...flightData,
                        destination: e.target.value,
                      });

                      validateField("destination", e.target.value);
                    }}
                  />

                </div>
              </div>



              {/* ===================================== */}
              {/* SCHEDULE SECTION */}
              {/* ===================================== */}
              <div className="pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-6">

                  <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>

                  <h6 className="text-slate-800 text-sm font-bold uppercase tracking-wider">
                    Schedule & Pricing
                  </h6>

                </div>


                {/* DATE PICKERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  {/* DEPARTURE DATE */}
                  <div>

                    <DatePicker
                      title="Departure Date"
                      value={flightData.departureDate}
                      onChange={(date) => {

                        setFlightData({
                          ...flightData,
                          departureDate: date,
                        });

                        validateField("departureDate", date);
                      }}
                    />

                    {errors.departureDate && (
                      <p className="text-red-500 text-sm mt-1 ml-1">
                        {errors.departureDate}
                      </p>
                    )}

                  </div>


                  {/* ARRIVAL DATE */}
                  <div>

                    <DatePicker
                      title="Arrival Date"
                      value={flightData.arrivalDate}
                      onChange={(date) => {

                        setFlightData({
                          ...flightData,
                          arrivalDate: date,
                        });

                        validateField("arrivalDate", date);
                      }}
                    />

                    {errors.arrivalDate && (
                      <p className="text-red-500 text-sm mt-1 ml-1">
                        {errors.arrivalDate}
                      </p>
                    )}

                  </div>

                </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

  <FloatingInput
    id="departureTime"
    label="Departure Time"
    type="time"
    value={flightData.departureTime}
    error={errors.departureTime}
    onChange={(e) => {
      setFlightData({
        ...flightData,
        departureTime: e.target.value,
      });

      validateField(
        "departureTime",
        e.target.value
      );
    }}
  />

  <FloatingInput
    id="arrivalTime"
    label="Arrival Time"
    type="time"
    value={flightData.arrivalTime}
    error={errors.arrivalTime}
    onChange={(e) => {
      setFlightData({
        ...flightData,
        arrivalTime: e.target.value,
      });

      validateField(
        "arrivalTime",
        e.target.value
      );
    }}
  />

</div>

                {/* PRICE + SEATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* PRICE */}
                  <div className="md:col-span-2">

                    <FloatingInput
                      id="price"
                      label="Base Price (DZ)"
                      type="number"
                      icon={DollarSign}
                      value={flightData.price}
                      error={errors.price}
                      onChange={(e) => {

                        setFlightData({
                          ...flightData,
                          price: e.target.value,
                        });

                        validateField("price", e.target.value);
                      }}
                    />

                  </div>

                    {/* TOTAL SEATS */}
  <FloatingInput
    id="totalSeats"
    label="Total Seats"
    type="number"
    value={flightData.totalSeats}
    error={errors.totalSeats}
    onChange={(e) => {
      setFlightData({
        ...flightData,
        totalSeats: e.target.value,
      });

      validateField("totalSeats", e.target.value);
    }}
  />

                </div>
              </div>


              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-3/4 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-r 
                  from-blue-600 to-indigo-600 px-6 py-4.5 text-base font-semibold text-white 
                  shadow-[0_0_20px_rgba(59,130,246,0.45)] transition-all duration-300 hover:scale-[1.01] hover:from-blue-500
                   hover:to-indigo-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] active:scale-95 focus:outline-none 
                   focus:ring-4 focus:ring-blue-200"
                >

                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />

                  Confirm and Add Flight

                </button>

              </div>

            </form>

          </div>
        </div>
      </div>
    </section>
  );
};
