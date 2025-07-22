"use client";
import { useCurrentTenantInfoStore } from "@/store";
import React, { useEffect, useState } from "react";
import TenantInfoForm from "../tenantInfoForm/TenantInfoForm";
import FileConfigMain from "../file-configs/FileConfigMain";
import ThemeGenerator from "../themeGenerator/ThemeGenerator";
import IconGenerator from "../iconGenerator/IconGenerator";

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
        <ThemeGenerator />
      ) : currentStep == 4 ? (
        <FileConfigMain />
      ) : (
        <IconGenerator />
      )}
    </>
  );
};

export default TenantSteps;
