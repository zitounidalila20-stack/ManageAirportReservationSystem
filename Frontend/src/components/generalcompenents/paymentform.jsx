import { PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import StatusPopup from "./StatusPopup";

export default function PaymentModal() {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popup, setPopup] = useState({
  show: false,
  type: "",
  title: "",
  message: "",
});

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    setPopup({
      show: true,
      type: "error",
      title: "Payment Not Ready",
      message: "Stripe is still loading. Please wait.",
    });
    return;
  }

  setIsProcessing(true);

  try {
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setPopup({
        show: true,
        type: "error",
        title: "Payment Failed",
        message: result.error.message,
      });
      setIsProcessing(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      const res = await axios.post(
        "http://localhost:5000/confirm-payment",
        {
          bookingID: location.state.bookingID,
          paymentIntentId: result.paymentIntent.id,
        }
      );

      const ticketId = res.data.ticketId;

      setPopup({
        show: true,
        type: "success",
        title: "Payment Successful",
        message: "Redirecting to your ticket...",
      });

      setTimeout(() => {
        navigate(`/eticket/${ticketId}`);
      }, 1500);
    }
  } catch (error) {
    setPopup({
      show: true,
      type: "error",
      title: "Error",
      message: "Payment failed. Please try again.",
    });
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="w-full max-w-[600px] bg-white rounded-3xl shadow-lg mx-auto p-8">

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <h1 className="text-2xl font-bold">Payment</h1>

        <PaymentElement />

        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="h-[60px] rounded-xl bg-black text-white font-bold"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>

      </form>
{popup.show && (
  <StatusPopup
    type={popup.type}
    title={popup.title}
    message={popup.message}
    buttonText="OK"
    onClick={() =>
      setPopup({ show: false, type: "", title: "", message: "" })
    }
  />
)}
    </div>
  );
}