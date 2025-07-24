"use client";
import { Error } from "@/public";
import React, { Dispatch, SetStateAction, useState } from "react";
import FontDropBox from "./ImageDropBox";
import { Button, Tooltip } from "@heroui/react";
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

const FontsUpload = () => {
  const [loading, setLoading] = useState(false);
  const [lightFontFile, setLightFontFile] = useState<File[]>([]);
  const [regularFontFile, setRegularFontFile] = useState<File[]>([]);
  const [boldFontFile, setBoldFontFile] = useState<File[]>([]);

  const handleSubmit = () => {
    if (
      lightFontFile.length == 0 &&
      regularFontFile.length == 0 &&
      boldFontFile.length == 0
    ) {
      showSnackbar("Please upload files", "warning");
      return;
    }
    const formData = new FormData();
    if (lightFontFile[0]) {
      formData.append("lightFont", lightFontFile[0]); // must match FastAPI param name
    }

    if (regularFontFile[0]) {
      formData.append("regularFont", regularFontFile[0]); // must match FastAPI param name
    }

    if (boldFontFile[0]) {
      formData.append("boldFont", boldFontFile[0]); // must match FastAPI param name
    }

    FontGeneratorApi.mutate({
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

  //font generator
  const FontGeneratorApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.createFonts,
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
    extensions,
  }: DropBoxContainerProps) => (
    <>
      <div
        className={`flex flex-col gap-3 p-3 rounded-2xl w-full shadow-fullShadow`}
      >
        <div className="flex justify-between px-1.5">
          <span className="heading4 text-outline">{title}</span>
          <Tooltip content={content} showArrow={true}>
            <span className="p-0 text-outline cursor-pointer">
              <Error />
            </span>
          </Tooltip>
        </div>
        <FontDropBox setFiles={setFiles} files={files} extensions={[".ttf"]} />
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col gap-5 p-5 grow">
        <DropBoxContainer
          content={`Upload light weight font file`}
          title={`Light`}
          setFiles={setLightFontFile}
          files={lightFontFile}
        />
        <DropBoxContainer
          content={`Upload regular weight font file`}
          title={`Regular`}
          setFiles={setRegularFontFile}
          files={regularFontFile}
        />
        <DropBoxContainer
          content={`Upload bold weight font file`}
          title={`Bold`}
          setFiles={setBoldFontFile}
          files={boldFontFile}
        />
      </div>
      <ProceedButton
        buttonType={"submit"}
        loading={loading}
        onClick={handleSubmit}
        className="flex gap-5"
        startContent={
          <>
            <Button
              className="min-h-10 w-full"
              color="primary"
              variant={"shadow"}
              size={"md"}
              onClick={handleProceed}
            >
              {"Default Fonts (QuickSand)"}
            </Button>
          </>
        }
      />
    </>
  );
};

export default FontsUpload;
