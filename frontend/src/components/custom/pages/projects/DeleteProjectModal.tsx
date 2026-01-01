import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteProjectModalProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

const DeleteProjectModal = ({ onConfirm, onClose }: DeleteProjectModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      let errorMessage = "Failed to delete project";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        if (
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null
        ) {
          const response = error.response as any;
          if (response.data?.message) {
            errorMessage = response.data.message;
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
        } else if ("message" in error) {
          errorMessage = (error as any).message;
        }
      }
      
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-lg w-80 shadow-xl"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Delete Project?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleDelete}
              disabled={isDeleting}
              whileHover={{ scale: isDeleting ? 1 : 1.02 }}
              whileTap={{ scale: isDeleting ? 1 : 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteProjectModal;