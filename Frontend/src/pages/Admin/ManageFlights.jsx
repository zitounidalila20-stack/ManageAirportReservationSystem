import React, { useState } from 'react';
import AddFlight from "../../components/Admin/AddFlight";
import ViewAllFlight from "../../components/Admin/DisplayAllFlights";
import FloatingActionButton from "../../components/Admin/FloatingButton";
import AdminSidebar from '../../components/Admin/SideBarMenu'; // Imported as AdminSidebar

export default function ManageFlight() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-64 h-screen sticky top-0 shrink-0 z-40 border-r border-slate-200 bg-white">
        {/* Fixed: Changed from SidebarAdmin to AdminSidebar to match your import */}
        <AdminSidebar /> 
      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Content Header */}
        <header className="border-b border-slate-200 bg-white px-8 h-20 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Manage Flights</h1>
            <p className="text-xs text-slate-500 mt-0.5">Monitor, schedule, and configure active airline routes.</p>
          </div>
        </header>

        {/* Dynamic Data Table Area */}
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <ViewAllFlight />
          </div>
        </main>
        
      </div>

      {/* Floating Action Button (Plus Sign) */}
      <div onClick={() => setIsModalOpen(true)}>
        <FloatingActionButton />
      </div>

      {/* Centered Modal Overlay for adding new flights */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create New Flight</h3>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the fields below to dispatch a new route.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-white">
              <div className="max-w-3xl mx-auto">
                <AddFlight onSuccess={() => setIsModalOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}