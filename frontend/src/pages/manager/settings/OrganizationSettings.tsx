import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganizationCard from "@/components/custom/settings/OrganizationCard";
import CreateOrganizationModal from "@/components/custom/settings/CreateOrganizationModal";

const OrganizationSettings = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock data for organizations
    const organizations = [
        {
            id: 1,
            name: "Zyro Technologies",
            slug: "zyro-tech",
            role: "Owner",
            members: 12,
            isActive: true
        },
        {
            id: 2,
            name: "Client Solutions Inc",
            slug: "client-solutions",
            role: "Admin",
            members: 5,
            isActive: false
        },
        {
            id: 3,
            name: "Personal Projects",
            slug: "personal",
            role: "Member",
            members: 3,
            isActive: false
        }
    ];



    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Organization Settings</h2>
                    <p className="text-gray-600 mt-1">Manage your organizations and memberships</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                    <Plus size={16} className="mr-2" />
                    Create Organization
                </Button>
            </div>

            {/* Active Organization Card */}
            <motion.div
                className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/30 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="text-lg font-medium text-gray-800 mb-4">Active Organization</h3>
                {organizations.find(org => org.isActive) && (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                                <Building2 className="text-white" size={24} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">{organizations.find(org => org.isActive)?.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-600">
                                        {organizations.find(org => org.isActive)?.role === 'Owner' ? (
                                            <span className="flex items-center gap-1 text-amber-600">
                                                <Crown size={14} /> Owner
                                            </span>
                                        ) : organizations.find(org => org.isActive)?.role === 'Admin' ? (
                                            <span className="text-blue-600">Admin</span>
                                        ) : (
                                            <span className="text-gray-600">Member</span>
                                        )}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <Users size={14} /> {organizations.find(org => org.isActive)?.members} members
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                            Active
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Organizations List */}
            <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Your Organizations</h3>
                <div className="space-y-3">
                    {organizations.map((org) => (
                        <OrganizationCard
                            key={org.id}
                            name={org.name}
                            role={org.role}
                            members={org.members}
                            isActive={org.isActive}
                            onSwitch={!org.isActive ? () => console.log('Switch to', org.name) : undefined}
                        />
                    ))}
                </div>
            </div>

            <CreateOrganizationModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={(data) => {
                    console.log('Creating organization:', data);
                    setShowCreateModal(false);
                }}
            />
        </div>
    );
};

export default OrganizationSettings;