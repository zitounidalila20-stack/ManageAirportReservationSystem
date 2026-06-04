import { useEffect } from "react";
import axios from "axios";

import { useLocation } from "react-router-dom";

export default function SuccessPage() {

  const location = useLocation();

  useEffect(() => {

    axios.post(
      "http://localhost:5000/confirmBooking",
      location.state,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    .then((res) => {
      console.log("Booking confirmed");
    })
    .catch((err) => {
      console.log(err);
    });

  }, []);

  return (

    <div className="flex justify-center items-center h-screen">

      <div className="bg-white p-10 rounded-3xl shadow-xl">

        <h1 className="text-4xl font-bold text-green-600">
          Payment Successful
        </h1>

      </div>

    </div>
  );
}