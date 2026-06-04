import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCheck, PlaneTakeoff, BellRing, LogOut, ShieldAlert } from "lucide-react";

export default function EmployeeSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    {
      name: "Terminal Dashboard",
      path: "/StaffHome",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Walk-in Bookings",
      path: "/employee/bookings",
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      name: "Gate & Runway",
      path: "/employee/logistics",
      icon: <PlaneTakeoff className="w-5 h-5" />,
    },
    {
      name: "Airside Alerts",
      path: "/employee/broadcast",
      icon: <BellRing className="w-5 h-5" />,
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
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/60 flex flex-col justify-between p-4 fixed left-0 top-0 z-40 shadow-2xl shadow-black/20 font-sans select-none text-slate-200">
      
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 px-3 py-4 mb-8 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <PlaneTakeoff className="w-5 h-5 -rotate-45" />
          </div>

          <div>
            <h1 className="text-white font-black text-sm tracking-wide">
              Node<span className="text-blue-500">Air</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">
              Staff Panel
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? "text-white bg-blue-600 shadow-lg shadow-blue-600/10 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {/* خط الملاحة الجانبي المضيء */}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-white rounded-r-md"></span>
                )}

                <span className={`transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="pt-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
          Sign Out Shift
        </button>
      </div>
    </aside>
  );
}