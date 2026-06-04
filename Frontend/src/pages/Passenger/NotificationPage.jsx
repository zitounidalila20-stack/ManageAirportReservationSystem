import React, { useState, useEffect } from 'react';
import NotificationMessage from '../../components/generalcompenents/NotificationMessage';
import { BellOff } from 'lucide-react';

const NotificationPage = () => {
  // Store notifications (Mock data simulating backend payload)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'BOOKING_CONFIRMED',
      flightNumber: null,
      status: null,
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'FLIGHT_STATUS_CHANGED',
      flightNumber: 'AF123',
      status: 'Delayed',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      type: 'FLIGHT_STATUS_CHANGED',
      flightNumber: 'JL300',
      status: 'Boarding',
      timestamp: '3 hours ago'
    }
  ]);

  // Handler to clear all notifications to test the empty state
  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 mt-15">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">Stay updated with your flights and bookings in real-time</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dynamic rendering based on notifications array length */}
      {notifications.length === 0 ? (
        // 📭 Empty state view
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <div className="p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
            <BellOff className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Your inbox is empty</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            You don't have any notifications right now. We will alert you as soon as your flight status changes or a new booking is confirmed!
          </p>
        </div>
      ) : (
        // 🔔 Active notifications list view
        <div className="space-y-1">
          {notifications.map((notification) => (
            <NotificationMessage 
              key={notification.id} 
              notification={notification} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;