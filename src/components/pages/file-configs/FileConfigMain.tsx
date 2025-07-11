"use client";
import { CustomImage } from "@/components/atoms";
import { FileDropZone } from "@/components/templates";
import { ImageType } from "@/components/atoms/customImage/CustomImage";
import { Chat, CloseCircle, File, Images, TickCircle } from "@/public";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { ApiConstants } from "@/services/apiConstants";
import { showSnackbar } from "@/utils/utils";

const FileConfigMain = () => {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    FileConfigsUploadApi.mutate(formData);
  };

  const FileConfigsUploadApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<string>({
        endpoint: ApiConstants.FileConfigsUpload,
        method: HttpMethodApi.Post,
        data: sendData,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        showSnackbar(data.result, "danger");
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

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
          color="primary"
          variant={"shadow"}
          size={"md"}
          isLoading={loading}
          onClick={handleSubmit}
        >
          {"Proceed"}
        </Button>
      </div>
    </>
  );
};

export default FileConfigMain;
