import React from 'react';
import { Bell, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

const NotificationMessage = ({ notification }) => {
  const { type, status, flightNumber, timestamp } = notification;

  // Helper function to dynamically determine the layout and content of the notification
  const getNotificationDetails = () => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return {
          title: "Booking Confirmed! 🎉",
          message: "Congratulations, your booking has been confirmed and your ticket has been successfully issued. Have a wonderful flight!",
          icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
          bgColor: "bg-green-50 border-green-200"
        };

      case 'FLIGHT_STATUS_CHANGED':
        if (status === 'Delayed') {
          return {
            title: `Flight ${flightNumber} Delayed ⚠️`,
            message: `We would like to inform you that your flight number ${flightNumber} has been delayed. Please check the updated schedule.`,
            icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
            bgColor: "bg-amber-50 border-amber-200"
          };
        } else if (status === 'Boarding') {
          return {
            title: `Boarding Started for Flight ${flightNumber} ✈️`,
            message: `Final call! The boarding gates for flight number ${flightNumber} are now open. Please proceed to your gate immediately.`,
            icon: <Clock className="w-6 h-6 text-blue-500" />,
            bgColor: "bg-blue-50 border-blue-200"
          };
        } else if (status === 'Cancelled') {
          return {
            title: `Flight ${flightNumber} Cancelled ❌`,
            message: `We deeply apologize, but flight number ${flightNumber} has been cancelled due to operational reasons. Please contact customer support for rescheduling.`,
            icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
            bgColor: "bg-red-50 border-red-200"
          };
        }
        
        // Fallback case for other statuses (e.g., Scheduled, Landed, Departed)
        return {
          title: `Flight ${flightNumber} Status Update`,
          message: `Your flight status for ${flightNumber} has been updated to: ${status}.`,
          icon: <Bell className="w-6 h-6 text-gray-500" />,
          bgColor: "bg-gray-50 border-gray-200"
        };

      default:
        return {
          title: "New Notification",
          message: "You have a new update regarding your account or trip.",
          icon: <Bell className="w-6 h-6 text-purple-500" />,
          bgColor: "bg-purple-50 border-purple-200"
        };
    }
  };

  const details = getNotificationDetails();

  return (
    <div className={`flex items-start gap-4 p-4 mb-3 border rounded-xl shadow-sm transition-all ${details.bgColor}`}>
      <div className="p-2 rounded-lg bg-white shadow-sm shrink-0">
        {details.icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1">{details.title}</h4>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{details.message}</p>
        <span className="text-[10px] text-gray-400 block mt-2">{timestamp}</span>
      </div>
    </div>
  );
};

export default NotificationMessage;