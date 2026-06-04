import axios from "axios";
import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import EditModal from "../Admin/EditModel";

export default function Table({
  columns = [],
  data = [],
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingFlight, setEditingFlight] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const fields = [
    {
      key: "flight_number",
      label: "Flight Number",
    },
    {
      key: "airline",
      label: "Airline",
    },
    {
      key: "origin",
      label: "Origin",
    },
    {
      key: "destination",
      label: "Destination",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setEditData(flight);
    setIsEditOpen(true);
  };

  const handleChange = (key, value) => {
    setEditData((prev) => ({...prev,[key]: value,}));
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setEditingFlight(null);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.put(
        "http://localhost:5000/updateFlight",
        {
          flightID: editingFlight.flightID,
          ...editData,
        }
      );

      closeModal();

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (flight) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flight?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        "http://localhost:5000/deleteFlight",
        {
          data: {
            flightID: flight.flightID,
          },
        }
      );

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-w-full bg-white shadow px-8 pt-3">

      {/* SEARCH */}
      <div className="py-4">
        <input
          className="border p-2 w-1/3"
          placeholder="Search flights..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* TABLE */}
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="border-b px-6 py-3 text-left text-blue-500"
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((flight) => (
            <tr
              key={flight.flightID}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-6 py-3">
                {flight.flight_number}
              </td>

              <td className="px-6 py-3">
                {flight.airline}
              </td>

              <td className="px-6 py-3">
                {flight.origin}
              </td>

              <td className="px-6 py-3">
                {flight.destination}
              </td>

              <td className="px-6 py-3">
                {flight.status}
              </td>

              <td className="px-6 py-3">
                {new Date(
                  flight.departure_time
                ).toLocaleDateString()}
              </td>

              <td className="px-6 py-3">
                {new Date(
                  flight.departure_time
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="px-6 py-3 flex gap-3">
                <button
                  onClick={() =>
                    handleEdit(flight)
                  }
                  className="text-blue-500"
                >
                  <SquarePen />
                </button>

                <button
                  onClick={() =>
                    handleDelete(flight)
                  }
                  className="text-red-500"
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        isOpen={isEditOpen}
        onClose={closeModal}
        title="Edit Flight"
        fields={fields}
        formData={editData}
        onChange={handleChange}
        onSubmit={handleSave}
        isSubmitting={isSaving}
      />
    </div>
  );
}