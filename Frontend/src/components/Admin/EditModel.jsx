import React from "react";

export default function EditModal({
  isOpen,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[500px] rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <h2 className="text-xl font-bold mb-4">
          ✏️ {title}
        </h2>

        {/* FIELDS */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">

          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm text-gray-600">
                {f.label}
              </label>

              <input
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            </div>
          ))}

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}