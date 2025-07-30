"use client";
import { useCurrentTenantInfoStore, useTenantDataStore } from "@/store";
import React, { useEffect, useState } from "react";
import TenantInfoForm from "../tenantInfoForm/TenantInfoForm";
import FileConfigMain from "../file-configs/FileConfigMain";
import ThemeGenerator, { colors } from "../themeGenerator/ThemeGenerator";
import IconGenerator from "../iconGenerator/IconGenerator";
import FontsUpload from "../fontsUpload/FontsUpload";
import { base64ToFile, proceedStepsStatus, showSnackbar } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { GetTenantIdByNameModel, SetTenantInfoModel } from "@/services/models";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { useRouter } from "next/navigation";

const TenantSteps = () => {
  const router = useRouter(); // router used in procceed
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep
  );
  const tenantDataStore = useTenantDataStore();
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  const [uiLoading, setUiLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  useEffect(() => {
    const { tenantId, tenancyName } =
      useCurrentTenantInfoStore.getState().currentTenantInfo;
    if (tenantId) {
      GetTenantFormDataApi.mutate({ tenantId, tenancyName });
    }
  }, []);

  const handleProceed = () => {
    const stepsData = proceedStepsStatus(
      useCurrentTenantInfoStore.getState()?.currentTenantInfo?.steps!,
      useCurrentTenantInfoStore.getState()?.currentStep - 1,
      router
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
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
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

  //set tenant info api
  const GetTenantFormDataApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.GetTenantFormData,
        method: HttpMethodApi.Get,
        data: sendData,
      });
    },
    onMutate(variables) {
      setUiLoading(true);
    },
    onSettled(data, error, variables, context) {
      setUiLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        if (
          data?.result?.tenantFormData?.tenantId ==
          useCurrentTenantInfoStore.getState().currentTenantInfo.tenantId
        ) {
          tenantDataStore.setTenantFormInfo(data?.result?.tenantFormData!);
        } else {
          tenantDataStore.setTenantFormInfo({});
        }
        // file config
        const fileConfigs = data.result.fileConfigsData;
        if (fileConfigs?.success) {
          const {
            googleServicesJson,
            googleServiceInfoPlist,
            firebaseAdminsdkJson,
          } = fileConfigs;

          const files: File[] = [];

          if (googleServicesJson) {
            files.push(
              base64ToFile(
                googleServicesJson,
                "google-services.json",
                "application/json"
              )
            );
          }

          if (googleServiceInfoPlist) {
            files.push(
              base64ToFile(
                googleServiceInfoPlist,
                "GoogleService-Info.plist",
                "application/xml"
              )
            );
          }

          if (firebaseAdminsdkJson) {
            files.push(
              base64ToFile(
                firebaseAdminsdkJson,
                "firebase-adminsdk.json",
                "application/json"
              )
            );
          }

          tenantDataStore.setFilesConfig(files);
        } else {
          tenantDataStore.setFilesConfig([]);
        }
        if (data.result?.themeColors?.id) {
          const themeColorsTemp = {
            light: data.result.themeColors.light,
            dark: data.result.themeColors.dark,
          };
          tenantDataStore.setThemeColors(themeColorsTemp);
        } else {
          tenantDataStore.setThemeColors(colors);
        }
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
                  `light-${lightFont.fileName}`,
                  "application/json"
                )
              );
            }
            if (regularFont) {
              files.push(
                base64ToFile(
                  regularFont.base64,
                  `regular-${regularFont.fileName}`,
                  "application/json"
                )
              );
            }
            if (boldFont) {
              files.push(
                base64ToFile(
                  boldFont.base64,
                  `bold-${boldFont.fileName}`,
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
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  return (
    <>
      {currentStep == 1 ? (
        <TenantInfoForm handleProceed={handleProceed} uiLoading={uiLoading} />
      ) : currentStep == 2 ? (
        <FileConfigMain handleProceed={handleProceed} />
      ) : currentStep == 3 ? (
        <ThemeGenerator handleProceed={handleProceed} />
      ) : currentStep == 4 ? (
        <FontsUpload handleProceed={handleProceed} />
      ) : (
        <IconGenerator handleProceed={handleProceed} />
      )}
    </>
  );
};

export default TenantSteps;
