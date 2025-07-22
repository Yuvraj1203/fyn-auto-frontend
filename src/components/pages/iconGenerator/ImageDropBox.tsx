"use client";
import { Delete, Gallery, UploadButton } from "@/public";
import { showSnackbar } from "@/utils/utils";
import { Button } from "@heroui/react";
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
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
};

const ImageDropBox: FC<FileDropZoneProps> = ({
  files,
  setFiles,
  extensions,
}) => {
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleFileAdd = (file: File) => {
    if (!isValidFile(file)) return;
    setPreview(URL.createObjectURL(file));
    setFiles([file]);
  };

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileAdd(droppedFiles[0]);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleFileAdd(files[0]);
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

  const handleRemove = () => {
    setPreview(null);
    setFiles([]);
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`${
          dropZoneActive ? "" : ""
        } flex flex-col gap-3 bg-backgroundContainer grow h-40 items-center justify-center rounded-2xl p-3 text-center cursor-pointer duration-400`}
      >
        {files.length > 0 && files[0] instanceof File ? (
          <img
            src={URL.createObjectURL(files[0])}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <>
            <span
              className={`${
                dropZoneActive
                  ? "text-success scale-125"
                  : "text-outline scale-100"
              } flex items-center justify-center size-10 shadow-lightShadow rounded-2xl duration-400 bg-onPrimary`}
            >
              <Gallery />
            </span>
            <p
              className={`${
                dropZoneActive
                  ? "text-success scale-110"
                  : "text-outline scale-100"
              } duration-400`}
            >
              <span>max 5mb</span>
            </p>
          </>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptString}
      />
      <div className="flex justify-between gap-2 mt-2">
        <Button
          onClick={handleClick}
          className="w-full"
          color="primary"
          endContent={<UploadButton />}
        >
          Upload
        </Button>
        <Button
          onClick={handleRemove}
          className="w-full"
          variant="ghost"
          color="primary"
          endContent={<Delete />}
        >
          Remove
        </Button>
      </div>
    </>
  );
};

export default ImageDropBox;
