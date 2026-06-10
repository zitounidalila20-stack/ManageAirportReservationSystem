import { useState } from "react";
import { Plane, CalendarCheck, Send, Navigation, Landmark, Radio, CheckCircle, AlertTriangle } from "lucide-react";
import EmployeeSidebar from "../../components/AirlineCompany/EmployeeSidebar";

export default function EmployeeDashboard() {

  const [flightId, setFlightId] = useState("");
  const [assignedGate, setAssignedGate] = useState("");
  const [assignedRunway, setAssignedRunway] = useState("");

  // 2. حالات حجز الركاب السريع
  const [passport, setPassport] = useState("");
  const [targetFlight, setTargetFlight] = useState("");


  const [notifTarget, setNotifTarget] = useState("all");
  const [notifMessage, setNotifMessage] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 3500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex">
      <EmployeeSidebar />

      <main className="flex-1 w-full pl-76 pr-6 md:pr-10 pt-24 pb-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Staff Terminal Dashboard
              </h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                Welcome back! Manage walk-in bookings, dispatch broadcast notifications, and route active traffic.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-bold self-start sm:self-center">
              <Radio size={14} className="animate-pulse" /> Terminal 1 Terminal Controller
            </div>
          </div>

       
          {alertMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-center gap-2.5 shadow-sm animate-fade-in">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{alertMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CalendarCheck size={18} /></div>
                <h2 className="font-bold text-slate-900">Walk-in Passenger Booking</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Passenger Passport ID</label>
                  <input
                    type="text"
                    placeholder="e.g. N12345678"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 transition bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Flight Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AH-6012"
                    value={targetFlight}
                    onChange={(e) => setTargetFlight(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 transition bg-slate-50/50"
                  />
                </div>
                <button 
                  onClick={() => {
                    if(!passport || !targetFlight) return alert("Please fill all booking fields");
                    triggerAlert(` Ticket issued successfully for passport [${passport}] on flight [${targetFlight}]!`);
                    setPassport(""); setTargetFlight("");
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition active:scale-95 shadow-sm shadow-blue-500/10"
                >
                  Generate Ticket & Boarding
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Plane size={18} /></div>
                <h2 className="font-bold text-slate-900">Gate & Runway Assignment</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Incoming / Outgoing Flight</label>
                  <input
                    type="text"
                    placeholder="Select flight code..."
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-500 transition bg-slate-50/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assign Gate</label>
                    <select
                      value={assignedGate}
                      onChange={(e) => setAssignedGate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition bg-slate-50/50 text-slate-700"
                    >
                      <option value="">Select Gate</option>
                      <option value="Gate A1">Gate A1</option>
                      <option value="Gate A2">Gate A2</option>
                      <option value="Gate B1">Gate B1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assign Runway</label>
                    <select
                      value={assignedRunway}
                      onChange={(e) => setAssignedRunway(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition bg-slate-50/50 text-slate-700"
                    >
                      <option value="">Select Runway</option>
                      <option value="Runway 05L">Runway 05L</option>
                      <option value="Runway 05R">Runway 05R</option>
                      <option value="Runway 23">Runway 23</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if(!flightId || !assignedGate || !assignedRunway) return alert("Please specify flight, gate, and runway.");
                    triggerAlert(`⚡ Logistics Updated: Flight ${flightId} routed to ${assignedGate} via ${assignedRunway}.`);
                    setFlightId(""); setAssignedGate(""); setAssignedRunway("");
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition active:scale-95 shadow-sm shadow-indigo-500/10"
                >
                  Dispatch Routing Command
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Send size={18} /></div>
                <h2 className="font-bold text-slate-900">Airside Notification Broadcast</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Audience</label>
                  <select
                    value={notifTarget}
                    onChange={(e) => setNotifTarget(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 transition bg-slate-50/50 text-slate-700"
                  >
                    <option value="all">All Passengers (Terminal SMS/App)</option>
                    <option value="flight">Passengers of Specific Flight</option>
                    <option value="staff">Airport Internal Staff Members</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Notification / Alert Message</label>
                  <textarea
                    rows="2"
                    placeholder="Type urgent delay details, terminal updates or security change log..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-amber-500 transition bg-slate-50/50 resize-none"
                  ></textarea>
                </div>
                <button 
                  onClick={() => {
                    if(!notifMessage) return alert("Notification body cannot be blank");
                    triggerAlert(` Broadcast successfully transmitted to [Target: ${notifTarget}]!`);
                    setNotifMessage("");
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition active:scale-95 shadow-sm shadow-amber-500/10"
                >
                  Transmit Global Alert
                </button>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Current Gates Status Feed</h3>
                <p className="text-slate-400 text-xs mt-0.5">Real-time mapping monitoring of airport terminals.</p>
              </div>
              <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-500">Live Telemetry</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Terminal Gate</th>
                    <th className="px-6 py-3">Active Flight</th>
                    <th className="px-6 py-3">Assigned Runway</th>
                    <th className="px-6 py-3">Logistics Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/40">
                    <td className="px-6 py-3.5 flex items-center gap-2 font-bold text-slate-900"><Landmark size={14} className="text-slate-400" /> Gate A1</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-indigo-600 bg-indigo-50/40 px-2 py-0.5 rounded-md inline-block mt-1.5">AH-2014</td>
                    <td className="px-6 py-3.5 text-slate-500">Runway 05L</td>
                    <td className="px-6 py-3.5 text-emerald-600 text-xs font-bold">🟢 Boarding Secure</td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="px-6 py-3.5 font-bold text-slate-900"><Landmark size={14} className="text-slate-400" /> Gate A2</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-indigo-600 bg-indigo-50/40 px-2 py-0.5 rounded-md inline-block mt-1.5">DZ-9921</td>
                    <td className="px-6 py-3.5 text-slate-500">Runway 05R</td>
                    <td className="px-6 py-3.5 text-amber-600 text-xs font-bold">🟡 Final Call</td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="px-6 py-3.5 font-bold text-slate-900"><Landmark size={14} className="text-slate-400" /> Gate B1</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1.5">None</td>
                    <td className="px-6 py-3.5 text-slate-400">Unassigned</td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs font-bold">⚪ Standby Empty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}