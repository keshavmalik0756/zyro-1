// Project status utility functions

export const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-800";

  switch(status.toLowerCase()) {
    case "active":
      return "bg-blue-100 text-blue-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "upcoming":
      return "bg-purple-100 text-purple-800";
    case "delayed":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-purple-100 text-purple-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    case "in progress":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "on hold":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status?: string) => {
  if (!status) return null;

  switch(status.toLowerCase()) {
    case "active":
    case "inactive":
    case "upcoming":
      return "Clock";
    case "completed":
      return "CheckCircle";
    case "delayed":
    case "pending":
    case "on hold":
      return "AlertCircle";
    default:
      return "Clock";
  }
};