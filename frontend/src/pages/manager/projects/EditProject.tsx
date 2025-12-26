import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectApi } from "@/services/api/projectApi";
import toast from "react-hot-toast";
import ProjectForm from "@/components/custom/pages/projects/ProjectForm";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectApi.getProjectById(Number(id));
        setProject(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
        navigate("/projects");
      }
    };
    
    fetchProject();
  }, [id, navigate]);

  const handleUpdate = async (formData: FormData) => {
    try {
      await projectApi.updateProject(Number(id)!, formData);
      toast.success("Project updated successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    }
  };

  if (!project) return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
        <p className="text-gray-600 mt-1">Update the project details below</p>
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading project details...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
        <p className="text-gray-600 mt-1">Update the project details below</p>
      </div>
      <ProjectForm
        mode="edit"
        initialData={project}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/projects")}
      />
    </div>
  );
};

export default EditProject;