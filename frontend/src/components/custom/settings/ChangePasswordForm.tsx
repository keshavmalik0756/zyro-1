import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChangePasswordFormProps {
  onPasswordChange: (password: string) => void;
}

const ChangePasswordForm = ({ onPasswordChange }: ChangePasswordFormProps) => {
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
      onPasswordChange(passwordData.newPassword);
      
      // Reset form
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
      {passwordChanged && (
        <motion.div 
          className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock size={16} />
          <span>Password updated successfully!</span>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmitPassword}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength(passwordData.newPassword).color
                      }`}
                      style={{ width: `${passwordStrength(passwordData.newPassword).score * 33.33}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {passwordStrength(passwordData.newPassword).label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword 
                    ? 'border-red-500' 
                    : ''
                }`}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            disabled={
              isChangingPassword || 
              !passwordData.currentPassword || 
              !passwordData.newPassword || 
              !passwordData.confirmPassword ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
            className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? (
              <span className="flex items-center">Updating...</span>
            ) : (
              <span className="flex items-center">
                <Lock size={16} className="mr-2" />
                Update Password
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;