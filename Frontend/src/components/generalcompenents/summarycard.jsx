


import React, { useState } from "react";

export default function FlightSummary() {
  const [showTaxes, setShowTaxes] = useState(true);

  return (
    <div className=" relative z-10 max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      
      {/* Flight Info */}
      <div>
        <div className="flex justify-between items-center text-[15px] font-semibold text-gray-800">
          <span>Béjaïa (BJA) → Istanbul (IST)</span>
          <span>›</span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Sat, 02 May · 1 passenger
        </p>

        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
          <span>ℹ️</span>
          <span>Baggage and cancellation policy</span>
        </div>
      </div>

      <hr />

      {/* Total Price */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-800 font-semibold">
          <button
            onClick={() => setShowTaxes(!showTaxes)}
            className="flex items-center gap-1"
          >
            Total Price
            <span className="text-xs">{showTaxes ? "▲" : "▼"}</span>
          </button>

          <span>DZD 55,497.73</span>
        </div>

        {/* Passenger */}
        <div className="flex justify-between text-sm text-gray-700">
          <div>
            <p>1 Adult, Economy class</p>
            <p className="text-gray-400 text-xs">
              1 × DZD 44,798.52
            </p>
          </div>

          <span>DZD 44,798.52</span>
        </div>

        {/* Taxes */}
        <div>
          <div className="flex justify-between text-sm text-gray-700 font-medium">
            <button
              onClick={() => setShowTaxes(!showTaxes)}
              className="flex items-center gap-1"
            >
              Total Taxes
              <span className="text-xs">{showTaxes ? "▲" : "▼"}</span>
            </button>

            <span>DZD 10,699.12</span>
          </div>

          {showTaxes && (
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Adult tax</span>
                <span>DZD 423.73</span>
              </div>
              <div className="flex justify-between">
                <span>v5 tax</span>
                <span>DZD 529.66</span>
              </div>
              <div className="flex justify-between">
                <span>xe tax</span>
                <span>DZD 1,306.49</span>
              </div>
              <div className="flex justify-between">
                <span>yr tax</span>
                <span>DZD 8,439.24</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}