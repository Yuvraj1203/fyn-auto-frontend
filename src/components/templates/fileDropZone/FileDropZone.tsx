"use client";

import { CustomImage } from "@/components/atoms";
import { CloseCircle, Images, TickCircle, Upload } from "@/public";
import { useCurrentTenantInfoStore, useTenantDataStore } from "@/store";
import { showSnackbar } from "@/utils/utils";
import React, {
  ChangeEvent,
  Dispatch,
  DragEvent,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

type FileDropZoneProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
  hasCustomFunction?: boolean;
  fileUploadFunction?: (prev: File[], incoming: File[]) => File[];
};

const FileDropZone: FC<FileDropZoneProps> = ({
  setFiles,
  extensions,
  hasCustomFunction = false,
  fileUploadFunction,
}) => {
  const setTenantFilesStores = useTenantDataStore().setFilesConfig; // store

  const [dropZoneActive, setDropZoneActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  //considered extension
  const acceptString = extensions ? extensions.join(",") : "";

  const isValidFile = (file: File) => {
    const isValid = extensions
      ? extensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      : true;

    if (!isValid) {
      showSnackbar(
        `File "${file.name}" is not a valid format (${extensions?.join(", ")})`,
        "warning"
      );
    }

    return isValid;
  };

  const removeDuplicacy = (prev: File[], droppedFiles: File[]): File[] => {
    const newFiles = [...prev, ...droppedFiles];
    const uniqueFiles = Array.from(
      new Map(
        newFiles.map((file) => [`${file.name}-${file.size}`, file])
      ).values()
    );
    return uniqueFiles;
  };

  const uploadFilesFunction = (prev: File[], incoming: File[]): File[] => {
    let response;
    if (hasCustomFunction && fileUploadFunction) {
      response = fileUploadFunction(prev, incoming);
    } else {
      response = removeDuplicacy(prev, incoming);
    }
    setTenantFilesStores(response);
    return response;
  };

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      isValidFile
    );
    console.log(droppedFiles);
    setFiles((prev) => uploadFilesFunction(prev, droppedFiles));
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const droppedFiles = Array.from(files).filter(isValidFile);
    console.log(droppedFiles);
    setFiles((prev) => uploadFilesFunction(prev, droppedFiles));
    event.target.value = "";
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      setDropZoneActive(true);
      event.preventDefault();
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDropZoneActive(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`${
          dropZoneActive
            ? "border-success border-double"
            : "border-outline border-dashed"
        } flex flex-col gap-5 m-5 items-center border-2 rounded-2xl p-6 text-center cursor-pointer duration-400`}
      >
        <span
          className={`${
            dropZoneActive
              ? "text-success scale-125 rotate-45"
              : "text-outline scale-100"
          } flex items-center justify-center size-10 shadow-lightShadow rounded-2xl duration-400 `}
        >
          <Upload />
        </span>
        <p
          className={`${
            dropZoneActive ? "text-success scale-110" : "text-outline scale-100"
          } duration-400`}
        >
          <span>{`Drag and drop files here`}</span>
          <span className="text-onBackground">{` or `}</span>
          <span className="text-primary font-semibold underline">{`Browse Files`}</span>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={acceptString}
            multiple
          />
          {extensions && (
            <>
              <br />
              <span>{`(${extensions})`}</span>
            </>
          )}
        </p>
      </div>
    </>
  );
};

// const handleRemoveFile = (fileToRemove: File) => {
//   setFiles((prev) =>
//     prev.filter(
//       (file) =>
//         file.name !== fileToRemove.name || file.size !== fileToRemove.size
//     )
//   );
// };

// {files.length > 0 && (
//   <div className="flex flex-col p-5 gap-4">
//     {files.map((file, index) => {
//       return (
//         <div className="flex items-center gap-4 rounded-2xl p-3 border-1">
//           <CustomImage src={Images.foldericon} width={30} height={30} />
//           <div className="flex flex-col grow">
//             <p className="heading5">
//               {file.name} ({file.type || "unknown"})
//             </p>
//           </div>
//           <span className="text-success rounded-full hover:bg-success hover:text-onPrimary duration-400 cursor-pointer">
//             <TickCircle />
//           </span>
//           <span
//             className=" text-danger rounded-full hover:bg-danger hover:text-onPrimary duration-400 cursor-pointer "
//             onClick={() => handleRemoveFile(file)}
//           >
//             <CloseCircle />
//           </span>
//         </div>
//       );
//     })}
//   </div>
// )}

export default FileDropZone;
