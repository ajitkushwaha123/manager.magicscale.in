"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export const FileUploadComponent = ({ onFileChange, clearTrigger }) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    onFileChange(uploadedFiles);
    console.log("Files uploaded:", uploadedFiles);
  };

  return (
    <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col gap-4">
      <FileUpload onChange={handleFileUpload} clearTrigger={clearTrigger} />
    </div>
  );
};

export default FileUploadComponent;
