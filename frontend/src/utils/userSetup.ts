// User setup utility for initializing default Zyro users
export interface ZyroUser {
  name: string;
  email: string;
  role: string;
  password: string;
}

// Default Zyro users
export const defaultZyroUsers: ZyroUser[] = [
  {
    name: "Zyro Admin",
    email: "admin@zyro.com",
    role: "admin",
    password: "Admin@123"
  },
  {
    name: "Zyro Manager",
    email: "manager@zyro.com",
    role: "manager",
    password: "Manager@123"
  },
  {
    name: "Zyro Employee",
    email: "employee@zyro.com",
    role: "employee",
    password: "Employee@123"
  }
];

// Function to initialize default users in the system
export const initializeDefaultUsers = () => {
  // This function would typically be used to ensure default users exist
  // For mock data, this could be used to reset or initialize the mock data
  console.log("Default Zyro users initialized:", defaultZyroUsers);
  return defaultZyroUsers;
};