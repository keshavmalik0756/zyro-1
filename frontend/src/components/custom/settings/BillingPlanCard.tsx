import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillingPlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  current?: boolean;
  onPlanSelect?: () => void;
}

const BillingPlanCard = ({ 
  name, 
  price, 
  period, 
  features, 
  current = false,
  onPlanSelect
}: BillingPlanCardProps) => {
  return (
    <motion.div
      className={`border rounded-xl p-6 ${
        current 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-800">{price}</span>
            <span className="text-gray-600">/ {period}</span>
          </div>
        </div>
        {current && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Current
          </span>
        )}
      </div>
      
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            <Check size={14} className="text-green-500" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        className={`w-full mt-6 ${
          current 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg'
        }`}
        disabled={current}
        onClick={onPlanSelect}
      >
        {current ? 'Current Plan' : 'Select Plan'}
      </Button>
    </motion.div>
  );
};

export default BillingPlanCard;