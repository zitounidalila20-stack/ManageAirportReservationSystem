import { FileDown } from "lucide-react";

export default function ReportCard({ title, endpoint }) {

  const generateReport = () => {
    window.open(endpoint, "_blank");
  };

  const getColor = (title) => {
    switch (title.toLowerCase()) {
      case "all flights":
        return "#1E40AF";

      case "cancelled flights":
        return "#DC2626";

      case "scheduled flights":
        return "#16A34A";

      case "completed flights":
        return "#2563EB";

      default:
        return "#6B7280";
    }
  };

  const color = getColor(title);

  return (
    <button
      onClick={generateReport}
      style={{
        backgroundColor: color,
        color: "white",
        padding: "12px 18px",
        margin: "8px",
        border: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.opacity = "1";
      }}
    >
      <FileDown size={18} />
      {title}
    </button>
  );
}