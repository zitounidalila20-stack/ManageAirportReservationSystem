import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import UsersTable from "./UsersTable";
import StatusPopup from "../generalcompenents/StatusPopup";

export default function DisplayUsers() {
  const [allusers, setAllusers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [currentView, setCurrentView] = useState("all");
  const [loading, setLoading] = useState(false);

  // State for popup control
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/UsersData");
      setAllusers(response.data?.users || []);
    } catch (err) {
      console.log("USERS ERROR:", err);
      setAllusers([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/EmployeesData");
      setEmployees(response.data?.employees || []);
    } catch (err) {
      console.log("EMPLOYEES ERROR:", err);
      setEmployees([]);
    }
  };

  // ================= FETCH PASSENGERS =================
  const fetchPassengers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/PassengersData");
      setPassengers(response.data?.passengers || []);
    } catch (err) {
      console.log("PASSENGERS ERROR:", err);
      setPassengers([]);
    }
  };

  // ================= REFRESH FUNCTION =================
  const refreshAllData = async () => {
    console.log("Refreshing data for:", currentView);
    await Promise.all([fetchUsers(), fetchEmployees(), fetchPassengers()]);
  };

  // ================= HANDLE SUCCESSFUL ACTIONS =================
  const handleSuccess = async (action, entityType) => {
    // Refresh data first
    await refreshAllData();
    
    // Show success popup
    let title = "";
    let message = "";
    
    if (action === "delete") {
      title = "DELETED";
      message = `The ${entityType} has been successfully deleted.`;
    } else if (action === "update") {
      title = "UPDATED";
      message = `The ${entityType} details have been updated successfully.`;
    }
    
    setPopupConfig({
      isOpen: true,
      type: "success",
      title: title,
      message: message
    });
  };

  // ================= HANDLE FAILED ACTIONS =================
  const handleError = (errorMsg) => {
    setPopupConfig({
      isOpen: true,
      type: "error",
      title: "FAILED",
      message: errorMsg || "Something went wrong. Please try again."
    });
  };

  // ================= USE EFFECTS =================
  useEffect(() => {
    fetchUsers();
    fetchEmployees();
    fetchPassengers();
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [currentView]);

  // Get entity type for current view
  const getCurrentEntityType = () => {
    if (currentView === "all") return "user";
    if (currentView === "passengers") return "passenger";
    return "employee";
  };

  // ================= TABLE CONFIG =================
  const tableConfig = useMemo(() => {
    if (currentView === "all") {
      return {
        columns: [
          { id: 1, name: "User ID", key: "userID" },
          { id: 2, name: "Email", key: "email" },
          { id: 3, name: "Role", key: "role" },
          { id: 4, name: "Created At", key: "created_at" },
          { id: 5, name: "Actions", key: "actions" }
        ],
        data: allusers
      };
    }

    if (currentView === "passengers") {
      return {
        columns: [
          { id: 1, name: "Passenger ID", key: "passengerID" },
          { id: 2, name: "First Name", key: "first_name" },
          { id: 3, name: "Last Name", key: "last_name" },
          { id: 4, name: "Email", key: "email" },
          { id: 5, name: "Passport Number", key: "passport_number" },
          { id: 6, name: "Nationality", key: "nationality" },
          { id: 7, name: "Actions", key: "actions" }
        ],
        data: passengers
      };
    }

    return {
      columns: [
        { id: 1, name: "Employee ID", key: "employeeID" },
        { id: 2, name: "First Name", key: "first_name" },
        { id: 3, name: "Last Name", key: "last_name" },
        { id: 4, name: "Email", key: "email" },
        { id: 5, name: "Phone", key: "phone" },
        { id: 6, name: "Shift", key: "shift" },
        { id: 7, name: "Created at", key: "created_at" },
        { id: 8, name: "Actions", key: "actions" }
      ],
      data: employees
    };
  }, [currentView, allusers, passengers, employees]);

  return (
    <div style={{ padding: "20px" }}>
      {/* TABS BUTTONS */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setCurrentView("all")}
          className={`px-4 py-2 rounded font-medium transition-all ${currentView === "all" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          All Users
        </button>

        <button
          onClick={() => setCurrentView("passengers")}
          className={`px-4 py-2 rounded font-medium transition-all ${currentView === "passengers" ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Passengers
        </button>

        <button
          onClick={() => setCurrentView("employees")}
          className={`px-4 py-2 rounded font-medium transition-all ${currentView === "employees" ? "bg-purple-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Employees
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="mt-5 text-slate-500 animate-pulse">Loading real-time data...</p>
      )}

      {/* TABLE */}
      {!loading && (
        <UsersTable
          columns={tableConfig.columns || []}
          data={tableConfig.data || []}
          currentView={currentView}
          onDeleteSuccess={() => handleSuccess("delete", getCurrentEntityType())}
          onUpdateSuccess={() => handleSuccess("update", getCurrentEntityType())}
          onActionError={handleError}
        />
      )}

      {/* POPUP */}
      {popupConfig.isOpen && (
        <StatusPopup
          type={popupConfig.type}
          title={popupConfig.title}
          message={popupConfig.message}
          buttonText="OK"
          onClick={() => setPopupConfig({ ...popupConfig, isOpen: false })}
        />
      )}
    </div>
  );
}