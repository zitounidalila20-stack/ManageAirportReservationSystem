import React, { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import axios from "axios";
import EditModal from "./EditModel";

export default function UsersTable({
  columns = [],
  data = [],
  onDeleteSuccess,    // Changed from onDeletedRefresh
  onUpdateSuccess,    // Changed from onUpdatedRefresh
  onActionError,      // Changed from onActionFailed
  currentView,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const schemas = {
    all: [
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
    passengers: [
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "passport_number", label: "Passport Number" },
      { key: "nationality", label: "Nationality" },
    ],
    employees: [
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "shift", label: "Shift" },
    ],
  };

  const filteredData = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditData(row);
    setIsEditOpen(true);
  };

  const handleChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setEditData({});
    setEditingRow(null);
  };

  // ================= SAVE / EDIT FUNCTION =================
  const handleSave = async () => {
    try {
      setIsSaving(true);

      let endpoint = "";
      let idField = "";

      if (currentView === "all") {
        endpoint = "http://localhost:5000/updateUser";
        idField = "userID";
      } else if (currentView === "passengers") {
        endpoint = "http://localhost:5000/updatePassenger";
        idField = "passengerID";
      } else {
        endpoint = "http://localhost:5000/updateEmployee";
        idField = "employeeID";
      }

      await axios.put(endpoint, {
        [idField]: editingRow[idField],
        ...editData,
      });

      closeModal();
      
      // Call update success handler
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Update failed:", err);
      if (onActionError) {
        onActionError("Failed to update user. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ================= DELETE FUNCTION =================
  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      let endpoint = "";
      let idField = "";

      if (currentView === "all") {
        endpoint = "http://localhost:5000/deleteUser";
        idField = "userID";
      } else if (currentView === "passengers") {
        endpoint = "http://localhost:5000/deletePassenger";
        idField = "passengerID";
      } else {
        endpoint = "http://localhost:5000/deleteEmployee";
        idField = "employeeID";
      }

      await axios.delete(endpoint, {
        data: { [idField]: row[idField] },
      });

      // Call delete success handler
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      if (onActionError) {
        onActionError("Failed to delete user. Please try again.");
      }
    }
  };

  const fields = schemas[currentView] || schemas.all;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      {/* SEARCH */}
      <input
        className="border px-3 py-2 rounded w-1/3 mb-4 outline-none focus:border-blue-500 transition"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b bg-gray-50 text-gray-700">
              <th className="py-3 px-4">#</th>
              {columns.map((c) => (
                <th key={c.key} className="py-3 px-2 font-semibold text-sm">{c.name}</th>
              ))}
             </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6 text-gray-400 text-sm">
                  No matching results found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-500">{i + 1}</td>

                  {columns.map((col) =>
                    col.key === "actions" ? (
                      <td key="actions" className="py-3 px-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(row)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td key={col.key} className="py-3 px-2 text-sm text-gray-600">
                        {row[col.key] || "—"}
                      </td>
                    )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <EditModal
        isOpen={isEditOpen}
        onClose={closeModal}
        title={`Edit ${currentView}`}
        fields={fields}
        formData={editData}
        onChange={handleChange}
        onSubmit={handleSave}
        isSubmitting={isSaving}
      />
    </div>
  );
}