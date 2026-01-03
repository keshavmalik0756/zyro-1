import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";

/* ======================================================
   Types
====================================================== */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onDelete: (userId: number) => Promise<void>;
}

/* ======================================================
   Delete User Modal Component
====================================================== */

const DeleteUserModal = ({ isOpen, user, onClose, onDelete }: DeleteUserModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(user.id);
      // Modal will be closed by parent after successful delete
    } catch (error) {
      // Error is handled in parent
    } finally {
      setLoading(false);
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
            onClick={onClose}
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
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFEBE6] flex items-center justify-center">
                    <AlertTriangle size={24} className="text-[#DE350B]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#172B4D]">Delete User</h2>
                    <p className="text-sm text-[#6B778C] mt-1">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-[#F4F5F7] text-[#6B778C] hover:text-[#172B4D] transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-[#172B4D] mb-4">
                  Are you sure you want to delete <strong>{user.name}</strong> ({user.email})? This will permanently remove the user from your team.
                </p>

                <div className="bg-[#FFF4E6] border border-[#FFAB00] rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-[#974F00] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#974F00] mb-1">Warning</p>
                      <p className="text-xs text-[#974F00]">
                        All data associated with this user will be permanently deleted. This action cannot be reversed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 border border-[#DFE1E6] rounded-lg hover:bg-[#F4F5F7] text-[#172B4D] font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#DE350B] to-[#FF5630] text-white rounded-lg hover:from-[#FF5630] hover:to-[#DE350B] transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteUserModal;


