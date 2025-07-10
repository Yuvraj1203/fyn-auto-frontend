"use client";
import { CustomImage } from "@/components/atoms";
import { FileDropZone } from "@/components/templates";
import { ImageType } from "@/components/atoms/customImage/CustomImage";
import { Chat, CloseCircle, File, Images, TickCircle } from "@/public";
import { Button } from "@heroui/react";
import React, { useState } from "react";

const FileConfigMain = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prev) =>
      prev.filter(
        (file) =>
          file.name !== fileToRemove.name || file.size !== fileToRemove.size
      )
    );
  };

  const imagePreviewer = (file: File) => {
    if (file.type.startsWith("image/")) {
      return [URL.createObjectURL(file), ImageType.png];
    } else {
      return [File, ImageType.svg];
    }
  };

  return (
    <>
      <div className="grow overflow-auto customScrollbar">
        <FileDropZone setFiles={setFiles} extensions={[".json", ".plist"]} />
        {files.length > 0 && (
          <div className="flex flex-col p-5 gap-4">
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl p-3 border-1"
                >
                  <CustomImage
                    src={imagePreviewer(file).at(0)}
                    type={imagePreviewer(file).at(1)}
                    width={30}
                    height={30}
                    className="rounded-md"
                    color={"text-outline"}
                  />
                  <div className="flex flex-col grow">
                    <p className="heading5">
                      {file.name} ({file.type || "unknown"})
                    </p>
                  </div>
                  <span className="text-success rounded-full hover:bg-success hover:text-onPrimary duration-400 cursor-pointer">
                    <TickCircle />
                  </span>
                  <span
                    className=" text-danger rounded-full hover:bg-danger hover:text-onPrimary duration-400 cursor-pointer "
                    onClick={() => handleRemoveFile(file)}
                  >
                    <CloseCircle />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="bg-background border-t-1 border-surface px-5 py-4 sticky z-10 bottom-0 left-0 right-0 rounded-2xl">
        <Button
          className="min-h-10 w-full"
          type="submit"
          color="primary"
          variant={"shadow"}
          size={"md"}
        >
          {"Proceed"}
        </Button>
      </div>
    </>
  );
};

export default FileConfigMain;
