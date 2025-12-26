import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  Upload, 
  User, 
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from "lucide-react";

// Define the ProjectFormData interface
export interface UserObject {
  id: string;
  name: string;
}

export interface ProjectFormData {
  name: string;
  key: string;
  description: string;
  type: "software" | "marketing" | "design" | "ops";
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "active" | "archived";
  visibility: "private" | "team" | "public";
  startDate: string;
  endDate: string;
  owner: UserObject;
  teamMembers: UserObject[];
  milestones: string[];
  deliverables: string[];
  risks: string[];
  repoUrl?: string;
  docsUrl?: string;
  logo?: File | null;
  logoPreview?: string | null;
  cover?: File | null;
  coverPreview?: string | null;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: ProjectFormData;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  mode, 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  // Initialize form state
  const [project, setProject] = useState<ProjectFormData>({
    name: initialData?.name || "",
    key: initialData?.key || "",
    description: initialData?.description || "",
    type: initialData?.type || "software",
    priority: initialData?.priority || "medium",
    status: initialData?.status || (mode === 'create' ? 'active' : 'draft'),
    visibility: initialData?.visibility || "private",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    owner: initialData?.owner || { id: "", name: "" },
    teamMembers: initialData?.teamMembers || [],
    milestones: initialData?.milestones || [],
    deliverables: initialData?.deliverables || [],
    risks: initialData?.risks || [],
    repoUrl: initialData?.repoUrl || "",
    docsUrl: initialData?.docsUrl || "",
    logo: null,
    logoPreview: initialData?.logoPreview || null,
    cover: null,
    coverPreview: initialData?.coverPreview || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    settings: false,
    timeline: false,
    team: false,
    milestones: false,
    integrations: false,
    media: false
  });
  const [newTeamMember, setNewTeamMember] = useState("");
  const [newMilestone, setNewMilestone] = useState("");
  const [newDeliverable, setNewDeliverable] = useState("");
  const [newRisk, setNewRisk] = useState("");

  // Toggle accordion sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for project key - auto uppercase and prevent invalid chars
    if (name === 'key') {
      const upperValue = value.toUpperCase().replace(/[^A-Z]/g, '');
      setProject(prev => ({ ...prev, [name]: upperValue }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      setProject(prev => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: previewUrl
      }));
    }
  };

  // Add team member
  const addTeamMember = () => {
    if (newTeamMember.trim() && !project.teamMembers.some(member => member.name === newTeamMember.trim())) {
      setProject(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { id: '', name: newTeamMember.trim() }]
      }));
      setNewTeamMember("");
    }
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    setProject(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Add milestone
  const addMilestone = () => {
    if (newMilestone.trim()) {
      setProject(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone.trim()]
      }));
      setNewMilestone("");
    }
  };

  // Remove milestone
  const removeMilestone = (index: number) => {
    setProject(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  // Add deliverable
  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setProject(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }));
      setNewDeliverable("");
    }
  };

  // Remove deliverable
  const removeDeliverable = (index: number) => {
    setProject(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  // Add risk
  const addRisk = () => {
    if (newRisk.trim()) {
      setProject(prev => ({
        ...prev,
        risks: [...prev.risks, newRisk.trim()]
      }));
      setNewRisk("");
    }
  };

  // Remove risk
  const removeRisk = (index: number) => {
    setProject(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!project.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!project.key.trim()) {
      newErrors.key = "Project key is required";
    } else if (!/^[A-Z]+$/.test(project.key)) {
      newErrors.key = "Project key must contain only uppercase letters";
    }

    if (!project.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!project.endDate) {
      newErrors.endDate = "End date is required";
    } else if (project.startDate && project.endDate < project.startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!project.owner.id && !project.owner.name) {
      newErrors.owner = "Owner is required";
    }

    if (project.teamMembers.length < 1) {
      newErrors.teamMembers = "At least one team member is required";
    }

    if (project.repoUrl && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(project.repoUrl)) {
      newErrors.repoUrl = "Please enter a valid URL";
    }

    if (project.docsUrl && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(project.docsUrl)) {
      newErrors.docsUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", project.name.trim());
    formData.append("key", project.key); // Already uppercase due to input handler
    formData.append("description", project.description);
    formData.append("type", project.type);
    formData.append("priority", project.priority);
    formData.append("status", project.status);
    formData.append("visibility", project.visibility);
    formData.append("startDate", project.startDate);
    formData.append("endDate", project.endDate);
    formData.append("ownerId", project.owner.id || project.owner.name);
    formData.append("teamMembers", JSON.stringify(project.teamMembers.map(member => member.id || member.name)));
    formData.append("milestones", JSON.stringify(project.milestones));
    formData.append("deliverables", JSON.stringify(project.deliverables));
    formData.append("risks", JSON.stringify(project.risks));
    
    if (project.repoUrl) formData.append("repoUrl", project.repoUrl);
    if (project.docsUrl) formData.append("docsUrl", project.docsUrl);
    
    if (project.logo) formData.append("logo", project.logo);
    if (project.cover) formData.append("cover", project.cover);

    onSubmit(formData);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      project.logoPreview && URL.revokeObjectURL(project.logoPreview);
      project.coverPreview && URL.revokeObjectURL(project.coverPreview);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-6xl mx-auto">
      {/* Basic Information Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("basic")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Basic Information</h3>
          </div>
          {expandedSections.basic ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={project.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter project name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Key *
                  </label>
                  <input
                    type="text"
                    name="key"
                    value={project.key}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.key ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter project key (e.g., ZYR)"
                    maxLength={10}
                  />
                  <p className="mt-1 text-xs text-gray-500">Auto-uppercase letters only (e.g., ZYR)</p>
                  {errors.key && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.key}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe your project..."
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Settings Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("settings")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Project Settings</h3>
          </div>
          {expandedSections.settings ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.settings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      name="type"
                      value={project.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="software">Software</option>
                      <option value="marketing">Marketing</option>
                      <option value="design">Design</option>
                      <option value="ops">Operations</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={project.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    name="visibility"
                    value={project.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="private">Private</option>
                    <option value="team">Team</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                {mode === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={project.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("timeline")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Timeline</h3>
          </div>
          {expandedSections.timeline ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.timeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={project.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={project.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team & Roles Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("team")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Team & Roles</h3>
          </div>
          {expandedSections.team ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.team && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Owner *
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={project.owner.name}
                    onChange={(e) => setProject(prev => ({
                      ...prev,
                      owner: { ...prev.owner, name: e.target.value }
                    }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.owner ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter owner's name or ID"
                  />
                  {errors.ownerId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.ownerId}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add team member"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTeamMember();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {errors.teamMembers && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.teamMembers}
                    </p>
                  )}
                  
                  <div className="mt-2 space-y-2">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{member.name}</span>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestones & Deliverables Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("milestones")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Milestones & Deliverables</h3>
          </div>
          {expandedSections.milestones ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.milestones && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Milestones
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add a milestone"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMilestone();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{milestone}</span>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deliverables
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add a deliverable"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addDeliverable();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {project.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{deliverable}</span>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risks
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={newRisk}
                      onChange={(e) => setNewRisk(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add a risk"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRisk();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addRisk}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {project.risks.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{risk}</span>
                        <button
                          type="button"
                          onClick={() => removeRisk(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Integrations Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("integrations")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Integrations</h3>
          </div>
          {expandedSections.integrations ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.integrations && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    name="repoUrl"
                    value={project.repoUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.repoUrl ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://github.com/..."
                  />
                  {errors.repoUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.repoUrl}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    name="docsUrl"
                    value={project.docsUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.docsUrl ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://docs.example.com/..."
                  />
                  {errors.docsUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.docsUrl}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Media Uploads Section */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection("media")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Media Uploads</h3>
          </div>
          {expandedSections.media ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </button>
        
        <AnimatePresence>
          {expandedSections.media && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                      </label>
                    </div>
                    {project.logoPreview && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img 
                          src={project.logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'cover')}
                        />
                      </label>
                    </div>
                    {project.coverPreview && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img 
                          src={project.coverPreview} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex flex-col sm:flex-row sm:justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-none"
        >
          {mode === "create" ? "Create Project" : "Update Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;