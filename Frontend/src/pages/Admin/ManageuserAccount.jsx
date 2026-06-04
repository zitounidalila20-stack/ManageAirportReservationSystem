import React, { useState } from 'react';
import CreateEmployeeAccount from "../../components/Admin/CreateEmployeeAccount";
import DisplayUsers from "../../components/Admin/DisplayUsers";
import AdminSidebar from "../../components/Admin/SideBarMenu";
import FloatingActionButton from "../../components/Admin/FloatingButton";

export default function ManageUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
      
      {/* 1. القائمة الجانبية للأدمن على اليسار */}
      <aside className="w-64 h-screen sticky top-0 shrink-0 z-40 border-r border-slate-200 bg-white">
        <AdminSidebar /> 
      </aside>

      {/* 2. منطقة المحتوى الرئيسية على اليمين */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* رأس الصفحة (Header) */}
        <header className="border-b border-slate-200 bg-white px-8 h-20 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">User Accounts</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage system access, employee credentials, and registered users.</p>
          </div>
        </header>

        {/* مكان عرض الجدول (DisplayUsers) */}
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <DisplayUsers />
          </div>
        </main>
        
      </div>

      {/* الزر العائم (Plus Sign) - عند الضغط يفتح المودال */}
      <div onClick={() => setIsModalOpen(true)}>
        <FloatingActionButton />
      </div>

      {/* النافذة المنبثقة (Modal) في منتصف الشاشة لإضافة موظف جديد */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          
          {/* الخلفية المضببة (Backdrop) - عند الضغط عليها تغلق النافذة */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* صندوق النافذة المنبثقة العريضة والمريحة للعين */}
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* رأس المودال */}
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Employee Account</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a new employee profile with proper roles and permissions.</p>
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

            {/* محتوى المودال (نموذج إنشاء حساب الموظف) */}
            <div className="p-8 overflow-y-auto flex-1 bg-white">
              <div className="max-w-3xl mx-auto">
                {/* قمنا بتمرير وظيفة الإغلاق ليتم استدعاؤها بعد إرسال الفورم بنجاح */}
                <CreateEmployeeAccount onSuccess={() => setIsModalOpen(false)} />
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}