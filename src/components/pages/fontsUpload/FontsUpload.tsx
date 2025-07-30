"use client";
import { Error } from "@/public";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FontDropBox from "./ImageDropBox";
import { Button, Tooltip } from "@heroui/react";
import { ProceedButton } from "@/components/common";
import { useMutation } from "@tanstack/react-query";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { base64ToFile, showSnackbar } from "@/utils/utils";
import { SetTenantInfoModel } from "@/services/models";
import { useCurrentTenantInfoStore, useTenantDataStore } from "@/store";
import CustomTextInput, {
  CustomTextInputType,
} from "@/components/molecules/customTextInput/CustomTextInput";
import { Roboto, Playfair_Display, Signika_Negative } from "next/font/google";

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

enum FontFamilyEnum {
  quicksand = "quicksand",
  playfair = "playfair",
  signika = "signika",
  roboto = "roboto",
  other = "other",
}

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // depends on font
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

export const signika = Signika_Negative({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // adjust weights as needed
  display: "swap",
});

const FontsUpload = ({ handleProceed }: FontsUploadProps) => {
  const fontDropDown = [
    {
      key: "quicksand",
      label: "QuickSand",
      className: "",
    },
    {
      key: "playfair",
      label: "PlayFair",
      className: playfair.className,
    },
    {
      key: "signika",
      label: "Signika",
      className: signika.className,
    },
    {
      key: "roboto",
      label: "Roboto",
      className: roboto.className,
    },
    {
      key: "other",
      label: "Other",
      className: "",
    },
  ];

  const tenantDataStore = useTenantDataStore();
  const [loading, setLoading] = useState(false);
  const [lightFontFile, setLightFontFile] = useState<File[]>([]);
  const [regularFontFile, setRegularFontFile] = useState<File[]>([]);
  const [boldFontFile, setBoldFontFile] = useState<File[]>([]);
  const [selectedFont, setSelectedFont] = useState(fontDropDown[0]);

  const handleSelectItemChange = (value: string | number) => {
    const selectedFont = fontDropDown.find((item, index) => item.key == value);
    setSelectedFont(selectedFont!);
    setLightFontFile([]);
    setRegularFontFile([]);
    setBoldFontFile([]);
  };

  useEffect(() => {
    console.log(
      tenantDataStore.fontsData.files,
      "tenantDataStore.fontsData.files"
    );
    tenantDataStore.fontsData.files?.map((item) => {
      if (item.name?.includes("light")) {
        setLightFontFile([item]);
      }
      if (item.name?.includes("regular")) {
        setRegularFontFile([item]);
      }
      if (item.name?.includes("bold")) {
        setBoldFontFile([item]);
      }
    });
    const selectedFontObject = fontDropDown.find(
      (item) => item.key == tenantDataStore.fontsData.defaultFontName
    );
    setSelectedFont(selectedFontObject ?? fontDropDown[0]);
  }, [tenantDataStore.fontsData]);

  const handleSubmit = () => {
    if (!selectedFont?.key)
      return showSnackbar("Please select the font", "warning");
    const formData = new FormData();

    if (selectedFont?.key == FontFamilyEnum.other) {
      if (
        lightFontFile.length == 0 &&
        regularFontFile.length == 0 &&
        boldFontFile.length == 0
      ) {
        showSnackbar("Please upload files", "warning");
        return;
      }

      if (lightFontFile[0]) {
        formData.append("lightFont", lightFontFile[0]); // must match FastAPI param name
      }

      if (regularFontFile[0]) {
        formData.append("regularFont", regularFontFile[0]); // must match FastAPI param name
      }

      if (boldFontFile[0]) {
        formData.append("boldFont", boldFontFile[0]); // must match FastAPI param name
      }
    }

    FontGeneratorApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId,
        tenancyName:
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenancyName,
        defaultFont: selectedFont?.key == FontFamilyEnum.other ? false : true,
        defaultFontName: selectedFont?.key,
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
        endpoint: ApiConstants.CreateFonts,
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
        if (data.result.fontsData?.id) {
          const fontName = data.result.fontsData.defaultFontName;
          const fileConfigs = data.result.fontsData.files; //files
          if (fileConfigs?.success) {
            const files: File[] = [];

            const { lightFont, regularFont, boldFont } = fileConfigs;

            if (lightFont) {
              files.push(
                base64ToFile(
                  lightFont.base64,
                  lightFont.fileName.includes("light")
                    ? lightFont.fileName
                    : `light-${lightFont.fileName}`,
                  "application/json"
                )
              );
            }
            if (regularFont) {
              files.push(
                base64ToFile(
                  regularFont.base64,
                  regularFont.fileName.includes("regular")
                    ? regularFont.fileName
                    : `regular-${regularFont.fileName}`,
                  "application/json"
                )
              );
            }
            if (boldFont) {
              files.push(
                base64ToFile(
                  boldFont.base64,
                  boldFont.fileName.includes("bold")
                    ? boldFont.fileName
                    : `bold-${boldFont.fileName}`,
                  "application/json"
                )
              );
            }

            tenantDataStore.setFontsData({
              files: files,
              defaultFontName: fontName,
            });
          }
        }
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
        <CustomTextInput
          label="Font Family"
          type={CustomTextInputType.select}
          displayKey={"label"}
          selectItems={fontDropDown}
          selectedValue={selectedFont}
          isRequired={true}
          handleSelectItemChange={handleSelectItemChange}
        />
        {selectedFont?.key == FontFamilyEnum.other ? (
          <>
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
          </>
        ) : (
          <>
            <div
              className={`${selectedFont?.className} p-5 flex flex-col items-center gap-2 text-center`}
            >
              <p className={` font-normal`}>
                {"The quick brown fox jumps over the lazy dog. 1234567890"}
              </p>
              <p className={` font-medium`}>
                {"The quick brown fox jumps over the lazy dog. 1234567890"}
              </p>
              <p className={` font-semibold`}>
                {"The quick brown fox jumps over the lazy dog. 1234567890"}
              </p>
              <p className={` font-bold`}>
                {"The quick brown fox jumps over the lazy dog. 1234567890"}
              </p>
            </div>
          </>
        )}
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
