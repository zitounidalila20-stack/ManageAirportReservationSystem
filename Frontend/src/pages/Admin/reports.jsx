import { FileDown, RefreshCw, BarChart3, DollarSign } from "lucide-react";
import { useState } from "react";
import ReportCard from "../../components/Admin/ReportCard";
import AdminSidebar from "../../components/Admin/SideBarMenu";

export default function ReportsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    // 1. أزلنا overflow-hidden وأضفنا min-h-screen لتأمين المساحة الكلية خلف الشاشات
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex">
      
      {/* 2. الـ Sidebar الجانبي */}
      <AdminSidebar />

      {/* 3. محتوى التقارير - مضاف إليه حواف أمان (Padding Left) لدفعه بعيداً عن تداخل الـ Sidebar وحواف علوية للـ Navbar */}
      <main className="flex-1 w-full pl-72 pr-6 md:pr-10 pt-28 pb-12 overflow-x-hidden">
        
        <div className="max-w-7xl mx-auto">
          
          {/* الهيدر العلوي وعناوين لوحة التحكم */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 mt-1 text-xs md:text-sm">
                Flight status, cancellations, performance metrics, and global revenue.
              </p>
            </div>

            {/* الأزرار التفاعلية */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                onClick={handleRefreshAll}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition active:scale-95 shadow-sm"
              >
                <RefreshCw size={15} className={isRefreshing ? "animate-spin text-blue-500" : ""} />
                Refresh Data
              </button>
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-95"
              >
                <FileDown size={15} />
                Export Executive Summary
              </button>
            </div>
          </div>

          {/* محتوى البطاقات الشبكي */}
          <div className="space-y-8">
            
            {/* قسم العمليات اللوجستية */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <BarChart3 size={18} />
                </span>
                <h2 className="text-base md:text-lg font-bold text-slate-900">Logistics</h2>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <ReportCard
                    title="All Registered Flights"
                    endpoint="http://localhost:5000/reportsFlights"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <ReportCard
                    title="Scheduled Flights Status"
                    endpoint="http://localhost:5000/reportsFlightScheduled"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <ReportCard
                    title="Completed Flights Report"
                    endpoint="http://localhost:5000/reportsFlightsCompleted"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-red-100 bg-red-50/5 shadow-sm">
                  <ReportCard
                    title="Cancelled Flights Diagnostics"
                    endpoint="http://localhost:5000/reportsFlightsCancelled"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign size={18} />
                </span>
                <h2 className="text-base md:text-lg font-bold text-slate-900">Finance & Audits</h2>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <ReportCard
                  title="Financial Statements Overview"
                  endpoint="http://localhost:5000/reportsRevenue"
                />
              </div>
            </div>

          </div>

          {/* الفوتر */}
          <footer className="mt-16 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
            NodeAir Panel • Generated in Real-time • Confidential Executive Data
          </footer>

        </div>
      </main>
    </div>
  );
}