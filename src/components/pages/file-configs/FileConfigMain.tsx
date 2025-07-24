"use client";
import { CustomImage } from "@/components/atoms";
import { FileDropZone } from "@/components/templates";
import { ImageType } from "@/components/atoms/customImage/CustomImage";
import { Chat, CloseCircle, File, Images, TickCircle } from "@/public";
import { Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { ApiConstants } from "@/services/apiConstants";
import { proceedStepsStatus, showSnackbar } from "@/utils/utils";
import { useCurrentTenantInfoStore } from "@/store";
import { GetTenantIdByNameModel, SetTenantInfoModel } from "@/services/models";
import { ProceedButton } from "@/components/common";

const FileConfigMain = () => {
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles([]);
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prev) =>
      prev.filter(
        (file) =>
          file.name !== fileToRemove.name || file.size !== fileToRemove.size
      )
    );
  };

  const mergeValidTTFFiles = (
    prev: File[],
    incoming: File[],
    maxCount = 3
  ): File[] => {
    const updatedMap = new Map<string, File>();

    // Add existing files
    prev.forEach((file) => {
      if (file.name.toLowerCase().endsWith(".ttf")) {
        updatedMap.set(file.name, file);
      }
    });

    // Add/replace with incoming files
    incoming.forEach((file) => {
      if (file.name.toLowerCase().endsWith(".ttf")) {
        updatedMap.set(file.name, file); // Replace if same name
      }
    });

    // Limit to maxCount files
    return Array.from(updatedMap.values()).slice(0, maxCount);
  };

  const mergeValidFiles = (prev: File[], incoming: File[]): File[] => {
    const updatedMap = new Map<string, File>();

    // Add existing files to map
    prev.forEach((file) => {
      updatedMap.set(file.name, file);
    });

    incoming.forEach((file) => {
      const lowerName = file.name.toLowerCase();

      const isGoogleJson = lowerName === "google-services.json";
      const isPlist = file.name === "GoogleService-Info.plist";
      const isExtraJson =
        lowerName.endsWith(".json") && lowerName !== "google-services.json";

      // Only allow specific files
      if (isGoogleJson || isPlist || isExtraJson) {
        updatedMap.set(file.name, file); // replace if exists
      }
    });

    // Validate only 1 plist and max 2 jsons (1 named + 1 arbitrary .json)
    const finalFiles: File[] = [];
    let extraJsonAdded = false;

    for (const file of updatedMap.values()) {
      const name = file.name;
      const isGoogleJson = name.toLowerCase() === "google-services.json";
      const isPlist = name === "GoogleService-Info.plist";
      const isExtraJson = name.toLowerCase().endsWith(".json") && !isGoogleJson;

      if (isGoogleJson) finalFiles.push(file);
      else if (isPlist) finalFiles.push(file);
      else if (isExtraJson && !extraJsonAdded) {
        finalFiles.push(file);
        extraJsonAdded = true;
      }
    }

    return finalFiles;
  };

  const imagePreviewer = (file: File) => {
    if (file.type.startsWith("image/")) {
      return [URL.createObjectURL(file), ImageType.png];
    } else {
      return [File, ImageType.svg];
    }
  };

  const handleProceed = () => {
    const stepsData = proceedStepsStatus(
      useCurrentTenantInfoStore.getState()?.currentTenantInfo?.steps!,
      useCurrentTenantInfoStore.getState()?.currentStep - 1
    );
    if (currentStep == 2) {
      UpdateTenantStepApi.mutate({
        params: {
          tenantId:
            useCurrentTenantInfoStore.getState()?.currentTenantInfo.tenantId,
          step: stepsData.step,
        },
        data: stepsData.steps,
      });
    } else if (currentStep == 4) {
      //for font files
    }
  };

  const handleSubmit = () => {
    if (files.length == 0) {
      showSnackbar("Please upload files", "warning");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const reqBody = {
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenancyName,
      },
      data: formData,
    };

    if (currentStep == 2) {
      FileConfigsUploadApi.mutate(reqBody);
    } else if (currentStep == 4) {
      //font files
    }
  };

  const FileConfigsUploadApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.FileConfigsUpload,
        method: HttpMethodApi.Post,
        params: sendData.params,
        data: sendData.data,
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
        showSnackbar(data.result.message, "success");
        handleProceed();
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  //update tenant steps
  const UpdateTenantStepApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<GetTenantIdByNameModel>({
        endpoint: ApiConstants.UpdateTenantStep,
        method: HttpMethodApi.Patch,
        params: sendData.params,
        data: sendData.data,
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
        useCurrentTenantInfoStore.getState().setCurrentTenantInfo(data.result);
        useCurrentTenantInfoStore.getState().setCurrentStep(data.result.step!);
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  return (
    <>
      <div className="grow overflow-auto customScrollbar">
        <p className="text-outline px-5 pt-5">
          {currentStep == 2
            ? "Upload the mandatory files (.plist, .json) you want to use in your app."
            : "Upload the font files (.ttf) you want to use in your app."}
        </p>
        <FileDropZone
          setFiles={setFiles}
          extensions={currentStep == 2 ? [".json", ".plist"] : [".ttf"]}
          fileUploadFunction={
            currentStep == 2 ? mergeValidFiles : mergeValidTTFFiles
          }
          hasCustomFunction={true}
        />
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
                    className="rounded-md text-outline"
                  />
                  <div className="flex flex-col grow">
                    <p className="heading5">{file.name}</p>
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
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
      />
    </>
  );
};

export default FileConfigMain;
