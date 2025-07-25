"use client";
import { Error } from "@/public";
import React, { Dispatch, SetStateAction, useState } from "react";
import FontDropBox from "./ImageDropBox";
import { Button, Tooltip } from "@heroui/react";
import { ProceedButton } from "@/components/common";
import { useMutation } from "@tanstack/react-query";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { showSnackbar } from "@/utils/utils";
import { SetTenantInfoModel } from "@/services/models";
import { useCurrentTenantInfoStore } from "@/store";

type DropBoxContainerProps = {
  content?: string;
  title?: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
};
type FontsUploadProps = {
  handleProceed: () => void;
};

const FontsUpload = ({ handleProceed }: FontsUploadProps) => {
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
        <Button
          className="min-h-10 w-fit self-end font-semibold "
          color="primary"
          variant={"ghost"}
          size={"md"}
          onClick={handleProceed}
        >
          {"Default Fonts (QuickSand)"}
        </Button>
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
      />
    </>
  );
};

export default FontsUpload;
