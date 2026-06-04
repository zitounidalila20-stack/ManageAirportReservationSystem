export default function KpiCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
}) {
  const styles = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50 text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50 text-green-600",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      iconBg: "bg-red-50 text-red-600",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50 text-purple-600",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50 text-orange-600",
    },
  };

  const theme = styles[color] || styles.blue;

  return (
    <div className="
      relative overflow-hidden
      bg-white/80 backdrop-blur-md
      border border-gray-100
      rounded-2xl
      p-5
      shadow-sm
      transition-all duration-300
      hover:shadow-xl hover:-translate-y-1
    ">

      {/* top gradient bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient}`} />

      {/* soft background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-r ${theme.gradient}`} />

      <div className="flex items-center justify-between relative z-10">

        {/* ICON */}
        <div className={`p-3 rounded-xl ${theme.iconBg} shadow-sm`}>
          {Icon && <Icon size={22} />}
        </div>

        {/* TREND */}
        {trend !== undefined && (
          <span className={`
            text-xs font-semibold px-2 py-1 rounded-full
            ${trend >= 0
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
            }
          `}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}

      </div>

      {/* VALUE */}
      <h2 className="text-3xl font-extrabold mt-4 text-gray-900 tracking-tight">
        {value}
      </h2>

      {/* TITLE */}
      <p className="text-sm text-gray-500 mt-1 font-medium">
        {title}
      </p>

    </div>
  );
}