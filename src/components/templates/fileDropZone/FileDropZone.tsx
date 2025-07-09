"use client";

import { CustomImage } from "@/components/atoms";
import { Images, Upload } from "@/public";
import React, { useCallback, useState } from "react";

const FileDropZone: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col gap-5 m-5 items-center border-2 border-dashed border-outline rounded-md p-6 text-center cursor-pointer"
    >
      <span className="flex items-center justify-center size-10 shadow-lightShadow rounded-lg text-outline">
        <Upload />
      </span>
      <p className="text-gray-600">Drag and drop files here</p>
      {files.length > 0 && (
        <ul className="mt-4 text-left">
          {files.map((file, index) => (
            <li key={index} className="text-sm text-gray-700">
              {file.name} ({file.type || "unknown"})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDropZone;
