import { useNavigate } from "react-router-dom";
import { projectApi } from "@/services/api/projectApi";
import toast from "react-hot-toast";
import ProjectForm, { ProjectFormData } from "@/components/custom/pages/projects/ProjectForm";

const CreateProject = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData: ProjectFormData) => {
    try {
      const result = await projectApi.createProject(formData);
      console.log("Project created successfully:", result);
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
      
      // Extract error message from various error formats
      let errorMessage = "Failed to create project";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null) {
          const response = err.response as any;
          if (response.data?.message) {
            errorMessage = response.data.message;
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
        } else if ('message' in err) {
          errorMessage = (err as any).message;
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create New Project</h2>
        <p className="text-gray-600 mt-2">Fill in the details to create a new project and get started</p>
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
