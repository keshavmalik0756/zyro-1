import React from "react";

interface ProjectBadgeProps {
  projectName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/* ======================================================
   Project Badge
====================================================== */

const ProjectBadge: React.FC<ProjectBadgeProps> = ({
  projectName,
  size = "md",
  className = "",
}) => {
  /* -----------------------------------------------
     Generate Initials
     1 word  → 1 letter
     2 words → 2 letters
     3+ words → 3 letters
  ------------------------------------------------ */
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0]?.toUpperCase() ?? "";
    }

    if (words.length === 2) {
      return (
        words[0][0].toUpperCase() +
        words[1][0].toUpperCase()
      );
    }

    // 3 or more words → first 3 initials
    return words
      .slice(0, 3)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  /* -----------------------------------------------
     Deterministic Color Generator
  ------------------------------------------------ */
  const getColorClass = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-500 text-white",
      "bg-emerald-500 text-white",
      "bg-purple-500 text-white",
      "bg-amber-500 text-white",
      "bg-teal-500 text-white",
      "bg-indigo-500 text-white",
      "bg-sky-500 text-white",
      "bg-violet-500 text-white",
      "bg-cyan-500 text-white",
      "bg-rose-500 text-white",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  /* -----------------------------------------------
     Size Variants
  ------------------------------------------------ */
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const initials = getInitials(projectName);
  const colorClass = getColorClass(projectName);

  return (
    <div
      title={projectName}
      className={`
        flex-shrink-0 flex items-center justify-center
        rounded-md font-semibold uppercase
        ${sizeClasses[size]}
        ${colorClass}
        shadow-sm
        transition-transform duration-150
        hover:scale-105
        ${className}
      `}
    >
      {initials}
    </div>
  );
};

export default ProjectBadge;
