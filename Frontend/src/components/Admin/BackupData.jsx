import axios from "axios";
import { Database, Download } from "lucide-react";
import { useState } from "react";
import StatusPopup from "../generalcompenents/StatusPopup";

export default function BackupData() {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleBackup = async () => {
    try {
      setLoading(true);

      // التعديل هنا: تم تغيير الرابط إلى /api/backup والنوع إلى POST
      const response = await axios({
        url: "http://localhost:5000/api/backup", 
        method: "POST", 
        responseType: "blob", // ضروري جداً لاستقبال الملفات كـ Binary
      });

      // تحويل الـ Blob المستلم من السيرفر إلى رابط تحميل
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `NodeAir_Backup_${new Date().getTime()}.json`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // تنظيف الذاكرة بعد التحميل

      setPopup({
        show: true,
        type: "success",
        title: "SUCCESS",
        message: "Backup created successfully",
      });
    } catch (error) {
      console.error("React Backup Error:", error);
      setPopup({
        show: true,
        type: "error",
        title: "ERROR",
        message: "Failed to create backup. Server might be down.",
      });
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <>
      {popup.show && (
        <StatusPopup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClick={() => setPopup((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 w-full max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Database Backup</h2>
            <p className="text-slate-500 text-sm">Download a complete backup of the system</p>
          </div>
        </div>

        <button
          onClick={handleBackup}
          disabled={loading}
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-600/10"
        >
          <Download className="w-5 h-5" />
          {loading ? "Creating Backup..." : "Create Backup"}
        </button>
      </div>
    </>
  );
}