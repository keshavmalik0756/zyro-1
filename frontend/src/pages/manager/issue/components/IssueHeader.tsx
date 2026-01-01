import { motion } from "framer-motion";
import { Plus, Search, Filter, Settings, Grid3x3, List } from "lucide-react";

interface IssueHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedView: "board" | "list";
  onViewChange: (view: "board" | "list") => void;
  onCreateClick: () => void;
}

export const IssueHeader = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedView,
  onViewChange,
  onCreateClick,
}: IssueHeaderProps) => {
  return (
    <div className="border-b border-[#DFE1E6] bg-white">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-24 font-semibold text-[#172B4D] mb-0.5 truncate">
              Issues
            </h1>
            <p className="text-xs sm:text-sm text-[#6B778C] truncate">
              Search and filter all issues
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0052CC] text-white rounded font-medium text-xs sm:text-sm hover:bg-[#0065FF] transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>Create</span>
          </motion.button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Search Bar */}
          <div className="flex-1 min-w-0 sm:min-w-[200px] relative order-1 sm:order-none mr-0 sm:mr-3 md:mr-4">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#6B778C] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 bg-[#F4F5F7] border border-[#DFE1E6] rounded text-xs sm:text-sm text-[#172B4D] placeholder-[#6B778C] focus:outline-none focus:bg-white focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="
  flex items-center gap-1
  rounded-xl border border-[#DFE1E6]
  bg-white/70 backdrop-blur
  px-1 py-1
  shadow-sm
  order-3 sm:order-none
">
            <button
              onClick={() => onFilterChange("all")}
              className={`
      px-3 py-1.5 rounded-lg
      text-xs sm:text-sm font-medium
      transition-all duration-200
      whitespace-nowrap
      ${selectedFilter === "all"
                  ? "bg-[#0052CC] text-white shadow-sm"
                  : "text-[#42526E] hover:bg-[#F4F5F7]"
                }
    `}
            >
              All
            </button>

            <button
              onClick={() => onFilterChange("my-issues")}
              className={`
      px-3 py-1.5 rounded-lg
      text-xs sm:text-sm font-medium
      transition-all duration-200
      whitespace-nowrap
      ${selectedFilter === "my-issues"
                  ? "bg-[#0052CC] text-white shadow-sm"
                  : "text-[#42526E] hover:bg-[#F4F5F7]"
                }
    `}
            >
              My Issues
            </button>
          </div>


          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-[#DFE1E6] bg-white/70 backdrop-blur px-1 py-1 shadow-sm order-2 sm:order-none">
            <button
              onClick={() => onViewChange("board")}
              className={`
      relative px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
      flex items-center gap-1 sm:gap-1.5
      transition-all duration-200 whitespace-nowrap
      ${selectedView === "board"
                  ? "bg-[#E3FCEF] text-[#006644] shadow-sm"
                  : "text-[#42526E] hover:bg-[#F4F5F7]"
                }
    `}
            >
              <Grid3x3 className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
              <span>Board</span>
            </button>

            <button
              onClick={() => onViewChange("list")}
              className={`
      relative px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
      flex items-center gap-1 sm:gap-1.5
      transition-all duration-200 whitespace-nowrap
      ${selectedView === "list"
                  ? "bg-[#E3FCEF] text-[#006644] shadow-sm"
                  : "text-[#42526E] hover:bg-[#F4F5F7]"
                }
    `}
            >
              <List className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
              <span>List</span>
            </button>
          </div>

          {/* Filter & Settings */}
          <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-[#DFE1E6] pt-2 sm:pt-0 sm:pl-2 order-4 sm:order-none">
            <button className="px-2 sm:px-2.5 py-1.5 rounded text-xs sm:text-sm font-medium text-[#42526E] hover:bg-[#F4F5F7] transition-colors flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <Filter className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
              <span className="">Filters</span>
            </button>
            <button className="px-2 sm:px-2.5 py-1.5 rounded text-xs sm:text-sm font-medium text-[#42526E] hover:bg-[#F4F5F7] transition-colors">
              <Settings className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
