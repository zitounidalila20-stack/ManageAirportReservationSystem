import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Passenger/NavigationBar.jsx";
import Home from "./pages/Passenger/Home.jsx";
import AuthPage from "./pages/authpage";
import BookingFunctionResults from "./pages/Passenger/Bookingsearchresults.jsx";
import BookingInformation from "./pages/Passenger/Bookdetails.jsx";
import SelectSeat from "./components/Passenger/seats.jsx";
import PaymentForReservation from './pages/Passenger/payment.jsx';
import SuccessPage from "./pages/Passenger/SuccessPage.jsx";
import PaymentModal from "./components/generalcompenents/paymentform.jsx";
import ETicket from "./pages/Passenger/ETicket.jsx";
import FlightStatus from "./pages/Passenger/FlightStatus.jsx";
import NotificationPage from "./pages/Passenger/NotificationPage.jsx";
import Dashboard from "./pages/Admin/dashboard.jsx";
import ManageFlight from "./pages/Admin/ManageFlights.jsx";
import ManageUsers from "./pages/Admin/ManageuserAccount.jsx";
import ReportsPage from "./pages/Admin/reports.jsx";
import SettingsPage from "./pages/Admin/Settings.jsx";
import EmployeeDashboard from "./pages/AirportStaff/HomeAirportStaff.jsx";
import AssignGateRunay from "./pages/AirportStaff/Asigngaterunay.jsx";


export default function App() {
  const location = useLocation();

  const hideNavbar = 
    location.pathname.startsWith("/auth") || 
    location.pathname.startsWith("/login") || 
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/manage-flights") ||
    location.pathname.startsWith("/manage-users") ||
    location.pathname.startsWith("/reports")||
    location.pathname.startsWith("/settings")||
    location.pathname.startsWith("/StaffHome")||
    location.pathname.startsWith("/employee/logistics")||
    location.pathname.startsWith("employee/broadcast");

  return (
    <div>
      {!hideNavbar && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        
        <Route path="/searchresult" element={<BookingFunctionResults />} />
        <Route path="/makebooking" element={<BookingInformation/>} /> 
        <Route path="/seats" element={<SelectSeat/>} />
        <Route path="/makepayment" element={<PaymentForReservation />} /> 
        <Route path="/eticket/:ticketId" element={<ETicket />} />
        <Route path="/flightStatus" element={<FlightStatus />} />
        <Route path="/notifications" element={<NotificationPage />} />
        
        {/* Admin Pages*/}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-flights" element={<ManageFlight />} />
        <Route path="/manage-users" element={<ManageUsers/>} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Staff pages */}
        <Route path="/StaffHome" element={<EmployeeDashboard/>} />
           <Route path="/employee/logistics" element={<AssignGateRunay />} />
          {/* <Route path="/employee/broadcast" element={} />  */}
      </Routes>
    </div>
  );
}
