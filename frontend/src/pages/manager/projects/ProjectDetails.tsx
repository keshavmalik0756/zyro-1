import { useState, useEffect } from "react";
import { 
  useParams, 
  Outlet, 
  useLocation, 
  useNavigate, 
  Link 
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertCircle, 
  Kanban, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Folder, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  User,
  MoreHorizontal
} from "lucide-react";
// Ensure this path matches your project structure
import { projectApi } from "@/services/api/projectApi"; 

/* ========================================================================
   1. CONFIGURATION
   ======================================================================== */
const PROJECT_TABS = [
  { path: 'overview', label: 'Overview', icon: Activity },
  { path: 'issues', label: 'Issues', icon: AlertCircle },
  { path: 'kanban', label: 'Kanban', icon: Kanban },
  { path: 'team', label: 'Team', icon: Users },
  { path: 'timeline', label: 'Timeline', icon: CalendarIcon },
  { path: 'analytics', label: 'Analytics', icon: BarChart3 },
  { path: 'settings', label: 'Settings', icon: Settings },
];

/* ========================================================================
   2. CUSTOM HOOK (Data Logic)
   ======================================================================== */
const useProjectDetails = (id: string | undefined) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await projectApi.getProjectById(Number(id));
        setProject(res);
      } catch (err: any) {
        console.error("Failed to load project", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { project, loading, error };
};

/* ========================================================================
   3. MAIN COMPONENT
   ======================================================================== */
const ProjectDetails = () => {
  const { id } = useParams();
  const { project, loading } = useProjectDetails(id);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-redirect to overview
  useEffect(() => {
    if (location.pathname === `/projects/${id}` || location.pathname === `/projects/${id}/`) {
      navigate(`/projects/${id}/overview`, { replace: true });
    }
  }, [location.pathname, id, navigate]);

  // Loading State
  if (loading) return <ProjectSkeleton />;

  // Error/Empty State
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100">
            Project not found or failed to load.
        </div>
        <button onClick={() => navigate('/projects')} className="mt-4 text-sky-600 hover:text-sky-700 font-medium hover:underline">
          Go back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFBFC] flex flex-col relative overflow-hidden">
      
      {/* Background Decor - Subtle & Clean (Matches your theme) */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-50/50 via-white/40 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* ================= HEADER SECTION ================= */}
      <header className="px-4 sm:px-6 md:px-8 pt-6 pb-2 max-w-[1600px] mx-auto w-full">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/projects')}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-sky-700 transition-colors mb-6 w-fit"
        >
          <div className="p-1.5 rounded-full bg-white shadow-sm border border-gray-200 group-hover:border-sky-200 group-hover:scale-105 transition-all">
            <ArrowLeft size={14} />
          </div>
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Left: Project Context (Title, Desc) */}
          <div className="flex-1 min-w-0 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 mb-3"
            >
              <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                Project
              </span>
              <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-1.5">
                <Clock size={12} /> Last updated recently
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight truncate pb-2"
            >
              {project.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed max-w-full"
            >
              {project.description || "No description provided for this project."}
            </motion.p>
          </div>

          {/* Right: The "Glance" Card (Replaces the linear rows for better impact) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-5 rounded-2xl flex flex-col gap-4 sm:gap-5 w-full sm:w-auto sm:min-w-[300px] md:min-w-[360px] max-w-full"
          >
            {/* Top Row: Status & Actions */}
            <div className="flex items-center justify-between">
              <StatusBadge status={project.status} />
              <div className="flex gap-1">
                 <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Edit">
                    <Settings size={16} />
                 </button>
                 <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                    <AlertCircle size={16} />
                 </button>
              </div>
            </div>
            
            {/* Middle: Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wide">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-900">{project.progress || 0}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 1.2, ease: "circOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-sm"
                />
              </div>
            </div>

            {/* Bottom: Meta Grid */}
            <div className="grid grid-cols-2 gap-2 pt-3 sm:pt-4 border-t border-gray-100">
              <MetaItem icon={Folder} label={project.id} />
              <MetaItem icon={User} label={project.created_by || 'N/A'} />
              <MetaItem icon={CalendarIcon} label={new Date(project.start_date).toLocaleDateString()} />
            </div>
          </motion.div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="relative mt-2">
          <nav className="flex items-center gap-1 p-1.5 bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-xl w-full overflow-x-auto no-scrollbar shadow-sm">
            {PROJECT_TABS.map((tab) => {
              const isActive = location.pathname.includes(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={`/projects/${id}/${tab.path}`}
                  className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 outline-none flex items-center gap-1.5 sm:gap-2.5 select-none min-w-max z-10 whitespace-nowrap
                  ${isActive ? "text-sky-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"}`}
                >
                  {/* Floating "Active" Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <tab.icon 
                    size={14} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}
                  />
                  <span className="relative z-10 tracking-tight hidden sm:block">{tab.label}</span>
                  <span className="relative z-10 tracking-tight sm:hidden">{tab.label.substring(0, 2)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ================= CONTENT AREA ================= */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-200 shadow-sm min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 md:p-8 relative z-0"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ========================================================================
   4. HELPER COMPONENTS
   ======================================================================== */

const MetaItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 bg-gray-50 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg border border-gray-100 font-medium truncate">
    <Icon size={12} className="text-gray-400 shrink-0" />
    <span className="truncate">{label}</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toLowerCase() || 'active';
  
  const config: Record<string, { bg: string, text: string, border: string, icon: any }> = {
    active: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
    delayed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle },
    upcoming: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Clock },
  };

  const current = config[s] || config.active;
  const Icon = current.icon;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${current.bg} ${current.text} ${current.border}`}>
      <Icon size={12} />
      {status || 'Active'}
    </span>
  );
};

const ProjectSkeleton = () => (
  <div className="min-h-screen bg-[#FAFBFC] p-4 sm:p-8 flex flex-col items-center">
    <div className="w-full max-w-[1600px] space-y-6 sm:space-y-8 animate-pulse mt-8 sm:mt-12">
      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24 mb-6 sm:mb-8"></div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between">
        <div className="w-full space-y-4">
          <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-24 sm:w-32"></div>
          <div className="h-10 sm:h-12 bg-gray-200 rounded-lg w-full sm:w-3/4"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-1/2"></div>
        </div>
        <div className="w-full sm:w-auto h-40 sm:h-48 bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 max-w-full">
             <div className="h-full bg-gray-50 rounded-xl"></div>
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 sm:h-10 flex-shrink-0 bg-gray-200/60 rounded-lg w-20 sm:w-28"></div>)}</div>
      <div className="h-[300px] sm:h-[500px] bg-white rounded-2xl sm:rounded-3xl border border-gray-100 mt-4 sm:mt-6 w-full"></div>
    </div>
  </div>
);

export default ProjectDetails;