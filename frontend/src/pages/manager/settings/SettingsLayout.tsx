import { Outlet, useLocation, NavLink } from "react-router-dom";
import { Settings, Building2, User, CreditCard, Shield } from "lucide-react";
import { motion } from "framer-motion";

const SettingsLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/settings/organization", label: "Organization", icon: Building2 },
    { path: "/settings/profile", label: "Profile", icon: User },
    { path: "/settings/billing", label: "Billing", icon: CreditCard },
    { path: "/settings/security", label: "Security", icon: Shield },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your account and organization settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <motion.div 
          className="w-full md:w-64 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-l-2 hover:border-blue-300"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsLayout;