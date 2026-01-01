import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import DeleteProjectModal from "@/components/custom/pages/projects/DeleteProjectModal";
import { projectApi } from "@/services/api/projectApi";
// import { Project } from "@/services/api/types"; // Not using this since it's for home page
// Define local interface for project data
export interface Project {
  id: number | string;
  name: string;
  status: string;
  description: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  teamMembers?: number;
  progress?: number;
  lastUpdated?: string;
}
import { getStatusColor, getStatusIcon } from "@/utils/projectStatus";
import ProjectBadge from "@/components/custom/ProjectBadge";

interface ProjectCardProps {
  project: Project;
  refresh: () => void;
  onEdit?: (id: number) => void;
}

const ProjectCard = ({ project, refresh, onEdit }: ProjectCardProps) => {
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await projectApi.deleteProject(Number(project.id));
      setShowDelete(false);
      refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-2 min-w-0 mb-3">
          <div className="p-2 rounded-lg  text-sky-600 flex-shrink-0">
            <ProjectBadge projectName={project.name} size="md" />
          </div>
          <h3 className="font-bold text-gray-800 truncate flex-1">{project.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || 'No description provided'}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {(getStatusIcon(project.status) === 'Clock' || project.status.toLowerCase() === 'active' || project.status.toLowerCase() === 'inactive' || project.status.toLowerCase() === 'upcoming') && <Clock className="w-4 h-4" />}
            {getStatusIcon(project.status) === 'CheckCircle' && <CheckCircle className="w-4 h-4" />}
            {getStatusIcon(project.status) === 'AlertCircle' && <AlertCircle className="w-4 h-4" />}
            {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Active'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Start: {project.start_date || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>End: {project.end_date || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">{project.created_by || 'N/A'}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              View
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(Number(project.id)); }}
              className="text-xs px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors whitespace-nowrap"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDelete(true); }}
              className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {showDelete && (
        <DeleteProjectModal
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </motion.div>
  );
};

export default ProjectCard;