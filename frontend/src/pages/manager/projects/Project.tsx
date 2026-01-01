import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Folder,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectApi } from "@/services/api/projectApi";
import CreateProjectModal from "@/components/custom/pages/projects/CreateProjectModal";
import EditProjectModal from "@/components/custom/pages/projects/EditProjectModal";
import ProjectCard from "@/components/custom/pages/projects/ProjectCard";
import { Project as ProjectType } from "@/services/api/types";

const Project = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getProjects();
      setProjects(res);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-full bg-gray-50/50">
      {/* ================= HEADER - FIXED ================= */}
      <div className="relative top-0 left-0 right-0 z-30">
        <div className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-4 lg:py-5">
          {/* Title Section */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent truncate"
                >
                  Projects
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-600 mt-1"
                >
                  Manage and track your projects
                </motion.p>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchProjects}
                  className="flex items-center justify-center border-2 border-gray-300 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Refresh"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4"
                    >
                      <RefreshCw size={16} />
                    </motion.div>
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">Add</span>
                </motion.button>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-full space-y-4 xs:space-y-6"
        >
          {/* Loading State */}
          {loading && !error ? (
            <div className="flex flex-col items-center justify-center min-h-48 xs:min-h-64 py-8 xs:py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 xs:w-12 h-10 xs:h-12 border-4 border-sky-500 border-t-transparent rounded-full mb-3 xs:mb-4"
              />
              <p className="text-xs xs:text-sm text-gray-600 text-center">Loading projects...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center min-h-48 xs:min-h-64 py-8 xs:py-12">
              <AlertCircle className="w-10 xs:w-12 h-10 xs:h-12 text-red-500 mb-3 xs:mb-4" />
              <p className="text-xs xs:text-sm text-red-500 text-center mb-3 xs:mb-4 px-2">{error}</p>
              <button 
                onClick={fetchProjects}
                className="px-3 xs:px-4 py-1.5 xs:py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs xs:text-sm w-full xs:w-auto max-w-xs"
              >
                Retry
              </button>
            </div>
          ) : (
            /* Main Content */
            <>
              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 xs:py-12 text-center bg-white/50 backdrop-blur-sm rounded-xl xs:rounded-2xl border border-gray-200/50 px-4">
                  <Folder className="w-12 xs:w-16 h-12 xs:h-16 text-gray-300 mb-3 xs:mb-4" />
                  <h3 className="text-lg xs:text-xl font-semibold text-gray-700 mb-1 xs:mb-2">No projects found</h3>
                  <p className="text-xs xs:text-sm text-gray-500 mb-3 xs:mb-4">Try adjusting your search or filter criteria</p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="px-3 xs:px-4 py-1.5 xs:py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs xs:text-sm w-full xs:w-auto max-w-xs"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        refresh={fetchProjects}
                        onEdit={(id) => {
                          setEditingProjectId(id);
                          setIsEditModalOpen(true);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />

      {/* Edit Project Modal */}
      {editingProjectId && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          projectId={editingProjectId}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProjectId(null);
          }}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};

export default Project;
