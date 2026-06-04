import { useState } from "react";
import { Save, ShieldAlert, Globe, Mail, Sliders, ToggleLeft, ToggleRight, Server } from "lucide-react";
import AdminSidebar from "../../components/Admin/SideBarMenu";
import BackupData from "../../components/Admin/BackupData";

export default function SettingsPage() {
  // حالات تخزين متغيرات النظام الافتراضية
  const [apiUrl, setApiUrl] = useState("http://localhost:5000");
  const [adminEmail, setAdminEmail] = useState("admin@nodeair.com");
  const [maxFlights, setMaxFlights] = useState(150);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // محاكاة الاتصال بالسيرفر للحفظ
    setTimeout(() => {
      setIsSaving(false);
      alert("System Configuration Updated Successfully!");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex">
      {/* القائمة الجانبية المدمجة للنظام */}
      <AdminSidebar />

      {/* منطقة المحتوى الرئيسي المعزولة بمسافات أمان دقيقة */}
      <main className="flex-1 w-full pl-76 pr-6 md:pr-10 pt-24 pb-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* الهيدر العلوي المطور للمنصة */}
          <div className="border-b border-slate-200 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                System Global Settings
              </h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                Configure real-time production gateway variables, operational thresholds, and database maintenance routines.
              </p>
            </div>
            {/* مؤشر حي لحالة اتصال السيرفر */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold self-start md:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live & Operational
            </div>
          </div>

          {/* شبكة التقسيم الهندسي الذكي للواجهة الممتلئة */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* القسم الأيسر (7 أعمدة من أصل 12): نموذج التحكم بالبيئة التشغيلية */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Environment Variables</h2>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                {/* حقل رابط الباك إند */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
                    <Globe size={14} className="text-slate-400" />
                    Production API Gateway URL
                  </label>
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition bg-slate-50/50 font-mono"
                    required
                  />
                </div>

                {/* صف الحقول المزدوجة المتناسقة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
                      <Mail size={14} className="text-slate-400" />
                      Admin Contacts Email
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition bg-slate-50/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
                      <Server size={14} className="text-slate-400" />
                      Daily Flight Threshold
                    </label>
                    <input
                      type="number"
                      value={maxFlights}
                      onChange={(e) => setMaxFlights(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                {/* زر تفعيل وضع الصيانة التفاعلي */}
                <div className="p-4 bg-amber-50/40 border border-amber-200/70 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-900">Application Maintenance Mode</h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Redirect public users to a "Under Maintenance" landing screen during server migrations.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className="text-indigo-600 transition hover:text-indigo-700 shrink-0"
                  >
                    {maintenanceMode ? (
                      <ToggleRight className="w-12 h-12 text-amber-500" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* زر الحفظ السفلي المدمج */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 active:scale-95"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving Variables..." : "Save Configuration"}
                  </button>
                </div>
              </form>
            </div>

            {/* القسم الأيمن (5 أعمدة من أصل 12): حاوية أدوات الـ Backup الفورية وسجل العمليات */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* استدعاء الـ Backup Card الخاص بك ليكون في مكانه الهندسي الصحيح */}
              <div className="w-full">
                <BackupData />
              </div>

              {/* بطاقة إضافية ذكية لإظهار السجل وتعبئة الفراغ البصري */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Recent Cloud Backups Logs
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-700">nodeair_auto_snap_june2026.json</p>
                      <p className="text-slate-400 mt-0.5">Size: 4.8 MB • Today, 04:00 AM</p>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-medium">Auto</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-700">nodeair_manual_snap_may2026.json</p>
                      <p className="text-slate-400 mt-0.5">Size: 4.2 MB • 28 May 2026</p>
                    </div>
                    <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-medium">Admin</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}