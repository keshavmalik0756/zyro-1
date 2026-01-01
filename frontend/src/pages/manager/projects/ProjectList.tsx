import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, Plus, Search, Folder, Users, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/custom/pages/projects/ProjectCard";
import CreateProjectModal from "@/components/custom/pages/projects/CreateProjectModal";
import { Project } from "@/services/api/types";
import { projectApi } from "@/services/api/projectApi";

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

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



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 text-center">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button 
          onClick={fetchProjects}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors w-full sm:w-auto max-w-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-600">Manage and track your projects</p>
        </div>
        
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-600">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-xl font-bold text-gray-800">{projects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-xl font-bold text-gray-800">{projects.filter(p => p.status?.toLowerCase() === 'active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Projects</p>
              <p className="text-xl font-bold text-gray-800">{projects.filter(p => p.status?.toLowerCase() === 'completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Projects</p>
              <p className="text-xl font-bold text-gray-800">{projects.filter(p => p.status?.toLowerCase() === 'upcoming').length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors w-full sm:w-auto max-w-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                refresh={fetchProjects}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default ProjectList;