import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import AdminSidebar from "../../components/Admin/SideBarMenu";
import KPIkeys from "../../components/Admin/KpiKey";
import DestinationChart from "../../components/Admin/Charts/FlightByDestination";
import FlightStatusBarChart from "../../components/Admin/Charts/FlightStatusBarChar";
import RevenueChart from "../../components/Admin/Charts/RevenueChart";
import UsersPieChart from "../../components/Admin/Charts/usersPieChart";
import LatestFlight from "../../components/Admin/LatestFlight";
import LatestReservation from "../../components/Admin/LatestReservation";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "admin") {
        navigate("/");
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      navigate("/");
    }
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-6 space-y-6">

        {/* HEADER */}
        <div className="bg-blue-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Welcome back, manage your system in real time
          </p>
        </div>

        {/* KPI */}
        <div className="  rounded-2xl p-4">
          <KPIkeys />
        </div>

        {/* TOP CHART */}
        <div className="rounded-2xl p-5">
          <RevenueChart />
        </div>

          <div className="rounded-2xl p-4">
            <DestinationChart />
          </div>
        {/* CHART GRID */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">

  {/* Flight Status → takes 2/3 */}
  <div className="md:col-span-2 rounded-2xl p-4">
    <FlightStatusBarChart />
  </div>

  {/* Users Pie → takes 1/3 */}
  <div className="md:col-span-1 rounded-2xl p-4">
    <UsersPieChart />
  </div>

</div>

        {/* TABLES SECTION */}
        <div>
            <LatestFlight />
            <LatestReservation />
          

        </div>

      </main>
    </div>
  );
}
