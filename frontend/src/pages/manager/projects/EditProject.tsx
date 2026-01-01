import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditProjectModal from "@/components/custom/pages/projects/EditProjectModal";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/projects");
    }
  }, [id, navigate]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/projects");
  };

  const handleSuccess = () => {
    navigate("/projects");
  };

  return (
    <EditProjectModal
      isOpen={isModalOpen}
      projectId={Number(id)}
      onClose={handleModalClose}
      onSuccess={handleSuccess}
    />
  );
};

export default EditProject;