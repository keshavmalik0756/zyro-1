import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

export const FileUploadZone = ({
  onFileSelect,
  isUploading = false,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />

      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{
          backgroundColor: isDragActive ? "#EBF2FF" : "#F4F5F7",
          borderColor: isDragActive ? "#0052CC" : "#DFE1E6",
        }}
        className="relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload
              className={`w-8 h-8 ${
                isDragActive ? "text-[#0052CC]" : "text-[#6B778C]"
              }`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-[#172B4D]">
                Drag and drop your file here
              </p>
              <p className="text-xs text-[#6B778C] mt-1">
                or click to browse (Max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#0052CC]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#172B4D] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#6B778C]">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="flex-shrink-0 p-1 hover:bg-[#DFE1E6] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#6B778C]" />
              </button>
            )}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#172B4D] font-medium">Uploading...</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
