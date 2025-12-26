import React from 'react';

interface AssigneeAvatarProps {
  name: string;
}

const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({ name }) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="
      w-6 h-6 rounded-full 
      bg-gray-200 text-gray-700
      flex items-center justify-center
      text-[10px] font-semibold
      flex-shrink-0
    ">
      {initials}
    </div>
  );
};

export default AssigneeAvatar;