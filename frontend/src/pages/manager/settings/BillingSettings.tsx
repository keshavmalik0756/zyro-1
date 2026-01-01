import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BillingPlanCard from "@/components/custom/settings/BillingPlanCard";

const BillingSettings = () => {
  const [currentPlan, setCurrentPlan] = useState('pro');
  
  // Mock data for billing
  const currentSubscription = {
    plan: "Pro Plan",
    price: "$15",
    period: "per month",
    nextBilling: "Jan 15, 2024",
    features: [
      "Up to 5 projects",
      "Unlimited team members",
      "Advanced analytics",
      "Priority support"
    ]
  };
  
  const invoices = [
    { id: 1, date: "Dec 15, 2023", amount: "$15.00", status: "Paid" },
    { id: 2, date: "Nov 15, 2023", amount: "$15.00", status: "Paid" },
    { id: 3, date: "Oct 15, 2023", amount: "$15.00", status: "Paid" },
  ];
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$9',
      period: 'per month',
      features: ['Up to 3 projects', '5 team members', 'Basic analytics', 'Email support'],
      current: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      period: 'per month',
      features: ['Up to 5 projects', 'Unlimited team members', 'Advanced analytics', 'Priority support'],
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'per month',
      features: ['Unlimited projects', 'Unlimited team members', 'Advanced analytics', '24/7 dedicated support', 'Custom integrations'],
      current: false
    }
  ];

  const handlePlanChange = (planId: string) => {
    if (planId !== currentPlan) {
      setCurrentPlan(planId);
      console.log(`Switching to ${planId} plan`);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Billing Settings</h2>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan Card */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/30 rounded-xl p-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Current Plan</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">{currentSubscription.plan}</span>
              <span className="text-gray-600">•</span>
              <span className="text-lg font-semibold text-blue-600">{currentSubscription.price}</span>
              <span className="text-gray-600">/ {currentSubscription.period}</span>
            </div>
            <p className="text-gray-600 mt-1">
              Next billing: <span className="font-medium">{currentSubscription.nextBilling}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="border-gray-300 hover:bg-blue-50 hover:text-blue-700">
              Update Payment Method
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Plan Features</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSubscription.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700">
                <Check className="text-green-500" size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Plan Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Choose a Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <BillingPlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              current={plan.current}
              onPlanSelect={() => handlePlanChange(plan.id)}
            />
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <CreditCard className="text-white" size={12} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline" className="border-gray-300 hover:bg-blue-50 hover:text-blue-700">
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Invoice History</h3>
          <Button variant="outline" className="border-gray-300 hover:bg-blue-50 hover:text-blue-700">
            <Download size={16} className="mr-2" />
            Download All
          </Button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{invoice.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">Monthly Subscription</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{invoice.amount}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Download size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;