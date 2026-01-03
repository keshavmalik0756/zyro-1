import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Shield, Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { organizationApi } from "../../../services/api/organizationApi";

/* ======================================================
   Types
====================================================== */

interface Organization {
  id: number;
  name: string;
  description?: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: { name: string; email: string; role: string; organization_id: number }) => Promise<void>;
}

/* ======================================================
   Create User Modal Component
====================================================== */

const CreateUserModal = ({ isOpen, onClose, onCreate }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    organization: "",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch organizations when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      const orgs = await organizationApi.getOrganizations();
      setOrganizations(orgs || []);
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoadingOrgs(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.organization) {
      newErrors.organization = "Organization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        organization_id: parseInt(formData.organization),
      });
      // Reset form
      setFormData({ name: "", email: "", role: "employee", organization: "" });
      setErrors({});
    } catch (error) {
      // Error is handled in parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", email: "", role: "employee", organization: "" });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#DFE1E6]">
                <div>
                  <h2 className="text-xl font-bold text-[#172B4D]">Invite User</h2>
                  <p className="text-sm text-[#6B778C] mt-1">Send an invitation to join your team</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-[#F4F5F7] text-[#6B778C] hover:text-[#172B4D] transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#172B4D] mb-2">
                    <User size={16} className="inline mr-2 text-[#6B778C]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] bg-white text-[#172B4D] text-sm ${
                      errors.name ? "border-[#DE350B]" : "border-[#DFE1E6]"
                    }`}
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-xs text-[#DE350B] mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#172B4D] mb-2">
                    <Mail size={16} className="inline mr-2 text-[#6B778C]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="john.doe@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] bg-white text-[#172B4D] text-sm ${
                      errors.email ? "border-[#DE350B]" : "border-[#DFE1E6]"
                    }`}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#DE350B] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-[#172B4D] mb-2">
                    <Shield size={16} className="inline mr-2 text-[#6B778C]" />
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      setFormData({ ...formData, role: e.target.value });
                      if (errors.role) setErrors({ ...errors, role: "" });
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] bg-white text-[#172B4D] text-sm appearance-none cursor-pointer ${
                      errors.role ? "border-[#DE350B]" : "border-[#DFE1E6]"
                    }`}
                    disabled={loading}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs text-[#DE350B] mt-1">{errors.role}</p>
                  )}
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-semibold text-[#172B4D] mb-2">
                    <Building2 size={16} className="inline mr-2 text-[#6B778C]" />
                    Organization
                  </label>
                  {loadingOrgs ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 border border-[#DFE1E6] rounded-lg bg-[#F4F5F7]">
                      <Loader2 size={16} className="animate-spin text-[#0052CC]" />
                      <span className="text-sm text-[#6B778C]">Loading organizations...</span>
                    </div>
                  ) : (
                    <select
                      value={formData.organization}
                      onChange={(e) => {
                        setFormData({ ...formData, organization: e.target.value });
                        if (errors.organization) setErrors({ ...errors, organization: "" });
                      }}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] bg-white text-[#172B4D] text-sm appearance-none cursor-pointer ${
                        errors.organization ? "border-[#DE350B]" : "border-[#DFE1E6]"
                      }`}
                      disabled={loading || organizations.length === 0}
                    >
                      <option value="">Select an organization</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.organization && (
                    <p className="text-xs text-[#DE350B] mt-1">{errors.organization}</p>
                  )}
                  {!loadingOrgs && organizations.length === 0 && (
                    <p className="text-xs text-[#6B778C] mt-1">
                      No organizations available. Please create an organization first.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 border border-[#DFE1E6] rounded-lg hover:bg-[#F4F5F7] text-[#172B4D] font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#0065FF] text-white rounded-lg hover:from-[#0065FF] hover:to-[#0052CC] transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Invitation"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateUserModal;

