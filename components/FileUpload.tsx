
import React, { useState, useCallback, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, files }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles && newFiles.length > 0) {
      onFilesChange(newFiles);
    }
  }, [onFilesChange]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
     if (newFiles && newFiles.length > 0) {
      onFilesChange(newFiles);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${
          isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">Any files (ZIP, code, text) for context</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-300">Selected Files:</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-400 list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="truncate">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
