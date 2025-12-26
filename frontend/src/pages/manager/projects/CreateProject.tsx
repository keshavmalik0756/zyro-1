import { useNavigate } from "react-router-dom";
import { projectApi } from "@/services/api/projectApi";
import toast from "react-hot-toast";
import ProjectForm from "@/components/custom/pages/projects/ProjectForm";

const CreateProject = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData: FormData) => {
    try {
      await projectApi.createProject(formData);
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
        <p className="text-gray-600 mt-1">Fill in the details to create a new project</p>
      </div>
      <ProjectForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={() => navigate("/projects")}
      />
    </div>
  );
};

export default CreateProject;