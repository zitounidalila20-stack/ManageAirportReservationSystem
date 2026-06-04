import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import StatusPopup from "../../components/generalcompenents/StatusPopup.jsx";

import ProgressBar from "../../components/Passenger/progressbar";
import PassengerInformation from "../../components/Passenger/passengerinformations";
import ContactInformation from "../../components/Passenger/contactpassenger.jsx";
import SuccessHeadUp from "../../components/generalcompenents/HeadsUp/successHeadsup.jsx";
import AlertHeadUp from "../../components/generalcompenents/HeadsUp/alertHeadup.jsx";

export default function BookingInformation() {
  const location = useLocation();
  const navigate = useNavigate();

  const flight = location.state?.flight;
  const passengersCount = location.state?.passengers;

  const [passengers, setPassengers] = useState([]);
  const [contact, setContact] = useState({
    email: "",
    phoneNumber: ""
  });

  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [popup, setPopup] = useState({
  show: false,
  type: "",
  title: "",
  message: "",
});

  const handleSubmit = async () => {
  if (isSubmitting) return;

  const token = localStorage.getItem("token");
    console.log("SUBMIT CLICKED");

  
  console.log("TOKEN:", token);
if (!token) {
  setPopup({
    show: true,
    type: "warning",
    title: "Login Required",
    message: "Please log in or create an account first",
  });

  setTimeout(() => {
    navigate("/login");
  }, 2500);

  return;
}

  setIsSubmitting(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/savePersonalInformation",
      { flight, passengers, contact },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const bookingID =
      res.data.bookingID || res.data.bookingId;

    if (!bookingID) {
      setPopup({
        show: true,
        type: "error",
        title: "Booking Failed",
        message: "Unable to create booking.",
      });

      return;
    }

    setPopup({
      show: true,
      type: "success",
      title: "Success",
      message:
        "Passenger information saved successfully.",
    });

    setTimeout(() => {
      navigate("/seats", {
        state: {
          flight,
          bookingID,
          passengers,
        },
      });
    }, 1500);

  } catch (err) {

    if (err.response?.status === 403) {

      localStorage.removeItem("token");

      setPopup({
        show: true,
        type: "warning",
        title: "Session Expired",
        message:
          "Your session has expired. Please log in again.",
      });
      console.log("Popup should appear now");

      setTimeout(() => {
        navigate("/login");
      }, 3000);

      return;
    }

    setPopup({
      show: true,
      type: "error",
      title: "Error",
      message:
        "Something went wrong while processing your booking.",
    });
   
setTimeout(() => {
  setPopup({
    show: false,
    type: "",
    title: "",
    message: "",
  });
}, 3000);

setTimeout(() => {
  navigate("/seats", {
    state: {
      flight,
      bookingID,
      passengers,
    },
  });
}, 1500);

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-24 px-4">

      {/* ALERTS */}
      {alert === "success" && <SuccessHeadUp />}
      {alert === "error" && <AlertHeadUp />}

      {popup.show && (
  <StatusPopup
    type={popup.type}
    title={popup.title}
    message={popup.message}
  />
)}

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto">

        {/* GLASS CARD */}
        <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[35px] p-6 md:p-10 space-y-10">

          {/* glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

          <div className="relative">

            {/* TITLE */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="text-gray-500 mt-2">
                Enter passenger and contact details to continue
              </p>
            </div>

            {/* PROGRESS */}
            <div className="mb-10">
              <ProgressBar />
            </div>

            {/* PASSENGERS */}
            <div className="bg-white/60 border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">
              <PassengerInformation
                passengers={passengers}
                setPassengers={setPassengers}
                passengersCount={passengersCount}
              />
            </div>

            {/* CONTACT */}
            <div className="bg-white/60 border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm mt-6">
              <ContactInformation
                contact={contact}
                setContact={setContact}
              />
            </div>

            {/* BUTTON */}
            <div className="mt-10">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  w-full
                  h-14
                  rounded-2xl
                  font-semibold
                  text-lg
                  transition-all
                  duration-300

                  ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] shadow-lg hover:shadow-blue-400/40 text-white"
                  }
                `}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                Secure booking • Encrypted data • Instant confirmation
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}