"use client";
import { useCurrentTenantInfoStore } from "@/store";
import React, { useEffect, useState } from "react";
import TenantInfoForm from "../tenantInfoForm/TenantInfoForm";
import FileConfigMain from "../file-configs/FileConfigMain";

const TenantSteps = () => {
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  return (
    <>
      {currentStep == 1 ? (
        <TenantInfoForm />
      ) : currentStep == 2 ? (
        <FileConfigMain />
      ) : currentStep == 3 ? (
        <FileConfigMain />
      ) : currentStep == 4 ? (
        <FileConfigMain />
      ) : (
        <FileConfigMain />
      )}
    </>
  );
};

export default TenantSteps;
