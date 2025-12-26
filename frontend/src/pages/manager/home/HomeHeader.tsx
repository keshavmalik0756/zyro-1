import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Calendar } from "lucide-react";

/* ======================================================
   Home Header (Enhanced, Compact & Interactive)
====================================================== */

const HomeHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const userName = user?.name || "Manager";
  const organizationName = user?.name
    ? `${user.name}'s Organization`
    : "Your Organization";

  /* Time-based Greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        transition
      "
    >
      {/* Left Content */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 leading-tight">
          {organizationName}
        </h1>

        <p className="text-xs text-gray-600 mt-0.5">
          {greeting},{" "}
          <span className="font-medium text-gray-800">{userName}</span> 👋
        </p>
      </div>

      {/* Right Content - Date */}
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 px-3 py-1.5 rounded-lg border border-gray-200">
        <Calendar size={14} className="text-indigo-500" />
        <span className="font-medium">{today}</span>
      </div>
    </div>
  );
};

export default HomeHeader;
