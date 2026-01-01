import { motion } from "framer-motion";
import { X } from "lucide-react";
import { UIIssue } from "../hooks/useIssues";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: UIIssue | null;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  issue,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen || !issue) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#DFE1E6] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#172B4D]">Delete Issue</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F4F5F7] rounded text-[#6B778C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-[#42526E] mb-4">
            Are you sure you want to delete issue{" "}
            <span className="font-medium text-[#172B4D]">{issue.id}</span>? This
            action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#42526E] hover:bg-[#F4F5F7] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium bg-[#DE350B] text-white rounded hover:bg-[#BF2600] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
