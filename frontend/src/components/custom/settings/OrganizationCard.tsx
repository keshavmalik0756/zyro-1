import { Building2, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrganizationCardProps {
  name: string;
  role: string;
  members: number;
  isActive?: boolean;
  onSwitch?: () => void;
}
 
const OrganizationCard = ({ 
  name, 
  role, 
  members, 
  isActive = false,
  onSwitch
}: OrganizationCardProps) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        isActive 
          ? 'border-blue-300 bg-blue-50' 
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center">
            <Building2 className="text-white" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">
                {role === 'Owner' ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Crown size={12} /> Owner
                  </span>
                ) : role === 'Admin' ? (
                  <span className="text-blue-600">Admin</span>
                ) : (
                  <span className="text-gray-600">Member</span>
                )}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users size={12} /> {members} members
              </span>
            </div>
          </div>
        </div>
        {!isActive && onSwitch && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.03]"
            onClick={onSwitch}
          >
            Switch
          </Button>
        )}
        {isActive && (
          <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            Active
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;