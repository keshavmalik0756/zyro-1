import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Calendar, Sparkles } from "lucide-react";

/* ======================================================
   Home Header – Modern, Clean & Premium
====================================================== */

const HomeHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const userName = user?.name || "Manager";
  const organizationName = user?.name
    ? `${user.name}'s Workspace`
    : "Your Workspace";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      
      {/* Left Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-500" />
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {organizationName}
          </h1>
        </div>

        <p className="text-sm text-gray-600">
          {greeting},{" "}
          <span className="font-medium text-gray-800">
            {userName}
          </span>
          <span className="ml-1">👋</span>
        </p>
      </div>

      {/* Right Section – Date Badge */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-md">
        <Calendar size={16} className="text-indigo-500" />
        <span className="font-medium">{today}</span>
      </div>
    </div>
  );
};

export default HomeHeader;
