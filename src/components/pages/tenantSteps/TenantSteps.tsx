"use client";
import { useCurrentTenantInfoStore } from "@/store";
import React, { useEffect, useState } from "react";
import TenantInfoForm from "../tenantInfoForm/TenantInfoForm";
import FileConfigMain from "../file-configs/FileConfigMain";
import ThemeGenerator from "../themeGenerator/ThemeGenerator";
import IconGenerator from "../iconGenerator/IconGenerator";
import FontsUpload from "../fontsUpload/FontsUpload";
import { proceedStepsStatus, showSnackbar } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { GetTenantIdByNameModel } from "@/services/models";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { useRouter } from "next/navigation";

const TenantSteps = () => {
  const router = useRouter(); // router used in procceed
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

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

  return (
    <>
      {currentStep == 1 ? (
        <TenantInfoForm handleProceed={handleProceed} />
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
