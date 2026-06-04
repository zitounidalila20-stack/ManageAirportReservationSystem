import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlaneTakeoff, Users, BarChart3, LogOut, ShieldCheck, Settings } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();


  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Manage Flights",
      path: "/manage-flights",
      icon: <PlaneTakeoff className="w-5 h-5" />,
    },
    {
      name: "User Accounts",
      path: "/manage-users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: "Settings & Backup",
      path: "/settings", // تأكد أن هذا المسار يطابق الـ Route الخاص بصفحة الإعدادات الجديدة في App.js
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300 border-r border-blue-300/30 flex flex-col justify-between p-4 fixed left-0 top-0 z-40 shadow-2xl shadow-blue-500/10 font-sans select-none">
      {/* TOP */}
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-8 border-b border-blue-500/20">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center text-white shadow-md shadow-black/10">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-neutral-900 font-bold text-sm tracking-wide">NodeAir</h1>
            <p className="text-[10px] text-neutral-700/80 font-semibold tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "text-neutral-950 bg-white/80 backdrop-blur-md shadow-md shadow-blue-600/10 border border-white/40"
                    : "text-neutral-800/80 hover:text-neutral-950 hover:bg-white/30"
                }`}
              >
                <span className={`transition-colors ${isActive ? "text-blue-600" : "text-neutral-700 group-hover:text-neutral-950"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="pt-4 border-t border-blue-500/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-800 hover:text-red-700 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-neutral-700" />
          Logout
        </button>
      </div>
    </aside>
  );
}