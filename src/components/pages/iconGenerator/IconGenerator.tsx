"use client";
import { Error } from "@/public";
import React, { Dispatch, SetStateAction, useState } from "react";
import ImageDropBox from "./ImageDropBox";
import { Tooltip } from "@heroui/react";
import { ProceedButton } from "@/components/common";
import { useMutation } from "@tanstack/react-query";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { proceedStepsStatus, showSnackbar } from "@/utils/utils";
import { GetTenantIdByNameModel, SetTenantInfoModel } from "@/services/models";
import { useCurrentTenantInfoStore } from "@/store";

type DropBoxContainerProps = {
  content?: string;
  title?: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
};

const IconGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [appIconFile, setAppIconFile] = useState<File[]>([]);
  const [notificationIconFile, setNotificationIconFile] = useState<File[]>([]);
  const [appBannerFile, setAppBannerFile] = useState<File[]>([]);

  const handleSubmit = () => {
    if (
      appIconFile.length == 0 ||
      appBannerFile.length == 0 ||
      notificationIconFile.length == 0
    ) {
      showSnackbar("Please upload icons and images", "warning");
      return;
    }
    const formData = new FormData();
    if (appIconFile[0]) {
      formData.append("app_icon", appIconFile[0]); // must match FastAPI param name
    }

    if (appBannerFile[0]) {
      formData.append("app_banner", appBannerFile[0]); // must match FastAPI param name
    }

    if (notificationIconFile[0]) {
      formData.append("notification_icon", notificationIconFile[0]); // must match FastAPI param name
    }

    IconGeneratorApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenancyName,
      },
      data: formData,
    });
  };

  const handleProceed = () => {
    const stepsData = proceedStepsStatus(
      useCurrentTenantInfoStore.getState()?.currentTenantInfo?.steps!,
      useCurrentTenantInfoStore.getState()?.currentStep - 1
    );
    UpdateTenantStepApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState()?.currentTenantInfo.tenantId,
        step: stepsData.step,
      },
      data: stepsData.steps,
    });
  };

  //icon generator
  const IconGeneratorApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.iconGenerator,
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

  const DropBoxContainer = ({
    content,
    title,
    files,
    setFiles,
    extensions = [".png", ".svg", ".jpeg"],
  }: DropBoxContainerProps) => (
    <>
      <div
        className={`flex flex-col gap-3 p-3 rounded-2xl max-w-72 shadow-fullShadow`}
      >
        <div className="flex justify-between px-1.5">
          <span className="heading4 text-outline">{title}</span>
          <Tooltip content={content} showArrow={true}>
            <span className="p-0 text-outline cursor-pointer">
              <Error />
            </span>
          </Tooltip>
        </div>
        <ImageDropBox
          setFiles={setFiles}
          files={files}
          extensions={extensions}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-wrap gap-7 justify-around p-5 grow">
        <DropBoxContainer
          content={`Upload app icon or you can drag drop the icon here as well`}
          title={`App Icon`}
          setFiles={setAppIconFile}
          files={appIconFile}
        />
        <DropBoxContainer
          content={`Upload App Banner icon or you can drag drop the icon here as well`}
          title={`App Banner`}
          setFiles={setAppBannerFile}
          files={appBannerFile}
        />
        <DropBoxContainer
          content={`Upload Notification icon (Without background) or you can drag drop the icon here as well`}
          title={`Notification Icon`}
          setFiles={setNotificationIconFile}
          files={notificationIconFile}
        />
      </div>
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
      />
    </>
  );
};

export default IconGenerator;
