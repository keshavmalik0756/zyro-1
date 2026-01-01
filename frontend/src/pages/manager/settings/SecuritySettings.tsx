import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, LogOut, Clock, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChangePasswordForm from "@/components/custom/settings/ChangePasswordForm";

const SecuritySettings = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  // Mock last login data
  const lastLogin = {
    time: "December 15, 2024 at 2:30 PM",
    ip: "192.168.1.1",
    location: "New York, US"
  };
  
  const passwordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordChanged(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordChanged(false);
      }, 3000);
    }, 1500);
  };
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account security and credentials</p>
      </div>

      {/* Change Password Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="text-blue-600" size={20} />
          <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
        </div>
        
        <ChangePasswordForm onPasswordChange={(password) => console.log('Password changed:', password)} />
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div 
        className="bg-white rounded-xl p-6 border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
            <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline" className="border-gray-300 hover:bg-blue-50 hover:text-blue-700">
            Enable 2FA
          </Button>
        </div>
      </motion.div>

      {/* Last Login Information */}
      <motion.div 
        className="bg-white rounded-xl p-6 border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-blue-600" size={20} />
          <h3 className="text-lg font-medium text-gray-800">Last Login</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm text-gray-800">{lastLogin.time}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">IP Address</p>
              <p className="text-sm text-gray-800">{lastLogin.ip}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-gray-800">{lastLogin.location}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Logout from All Devices */}
      <motion.div 
        className="bg-white rounded-xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Logout from All Devices</h3>
            <p className="text-gray-600 mt-1">Sign out of all sessions except this one</p>
          </div>
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut size={16} className="mr-2" />
            Logout All
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;