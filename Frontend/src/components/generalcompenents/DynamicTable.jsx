import { useState } from "react";

export default function DynamicTable({columns = [],data = [],}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase()));
  const renderCell = (row, col) => {
  const value = row[col.key];
    if (value === null || value === undefined) return "-";
    // format date/time automatically
    if (
      col.key.toLowerCase().includes("date") ||
      col.key.toLowerCase().includes("time")
    ) {
      return new Date(value).toLocaleString();
    }

    // custom render support (optional)
    if (col.render) {
      return col.render(value, row);
    }

    return value;
  };

  return (
    <div className="min-w-full bg-white shadow px-8 pt-3">

      {/* SEARCH */}
      <div className="py-4">
        <input
          className="border p-2 w-1/3"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="min-w-full">

        {/* HEADER */}
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

        {/* BODY */}
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={row.id || index}
              className="border-b hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.id} className="px-6 py-3">
                  {renderCell(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}