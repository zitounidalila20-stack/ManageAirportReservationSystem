import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { stripePromise } from "../../lib/Stripe.jsx";
import NavBar from "../../components/Passenger/NavigationBar";
import PaymentModal from "../../components/generalcompenents/paymentform";
import FlightSummary from "../../components/generalcompenents/summarycard";

export default function PaymentForReservation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= DATA FROM PREVIOUS PAGE =================
  const {
    flight,
    bookingID,
    passengers,
    selectedSeat
  } = location.state || {};

  // ================= TEMP TOTAL PRICE =================
  // replace later with real calculation
  const totalPrice = 500;

  // ================= CREATE PAYMENT INTENT =================
  useEffect(() => {

    const createPaymentIntent = async () => {

      try {
        const response = await axios.post(
          "http://localhost:5000/createPaymentIntent",
          {
            amount: totalPrice
          }
        );
        console.log(response.data);
        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
        } else {
          setError("Failed to create payment intent");
        }

      } catch (err) {
        console.log("PAYMENT ERROR:");
        console.log(err);
        setError("Could not connect to payment server");

      } finally {

        setLoading(false);

      }
    };

    createPaymentIntent();

  }, []);



  // ================= LOADING =================
  if (loading) {
    return (
      <div>
        <NavBar />

        <div className="flex justify-center items-center h-screen">
          <div className="text-center">

            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>

            <p className="text-lg text-gray-600">
              Loading payment page...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div>
        <NavBar />

        <div className="flex justify-center items-center h-screen">

          <div className="bg-red-50 p-8 rounded-2xl shadow-lg max-w-md text-center">

            <div className="text-6xl mb-4">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Payment Error
            </h1>

            <p className="text-gray-700 mb-6">
              {error}
            </p>

            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Go Back
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ================= WAIT FOR CLIENT SECRET =================
  if (!clientSecret) {
    return (
      <div className="text-center mt-20 text-xl">
        Waiting for Stripe...
      </div>
    );
  }

  console.log("CLIENT SECRET:");
  console.log(clientSecret);

  // ================= PAYMENT PAGE =================
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret
      }}
    >
      <div>

        <NavBar />

        <div className="grid grid-cols-2 gap-8 px-8 mt-24">

          {/* PAYMENT FORM */}
          <div className="w-full">

            <PaymentModal />

          </div>

          {/* SUMMARY */}
          <div className="w-full">

            <FlightSummary
              flight={flight}
              bookingID={bookingID}
              passengers={passengers}
              selectedSeat={selectedSeat}
              totalPrice={totalPrice}
            />

          </div>

        </div>

      </div>
    </Elements>
  );
}