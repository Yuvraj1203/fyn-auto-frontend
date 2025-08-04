"use client";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { UserRoleEnum } from "@/services/models/loginModel/loginModel";
import { useCurrentTenantInfoStore, useUserStore } from "@/store";
import { Button } from "@heroui/react";
import React, { ReactNode, useEffect, useState } from "react";

type ProceedButtonProps = {
  loading?: boolean;
  buttonType?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
};

enum ButtonContentEnum {
  proceed = "Proceed",
  saveTenant = "Save Tenant",
}

const ProceedButton = ({
  loading = false,
  buttonType = "button",
  onClick,
  startContent,
  endContent,
  className,
}: ProceedButtonProps) => {
  const userStore = useUserStore().user;
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep
  );
  const timelineDataFromStore = useCurrentTenantInfoStore(
    (state) => state.currentTenantInfo
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);
  const [timelineData, setTimelineData] = useState(timelineDataFromStore);
  const [buttonContent, setButtonContent] = useState(ButtonContentEnum.proceed);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);
  useEffect(() => {
    setTimelineData(timelineDataFromStore);
  }, [timelineDataFromStore]);

  // check for the button content
  useEffect(() => {
    const isAnyPending = useCurrentTenantInfoStore
      .getState()
      .currentTenantInfo.steps?.findIndex(
        (item) => item.status == TenantStatusEnum.pending
      );
    if (isAnyPending! > -1) {
      setButtonContent(ButtonContentEnum.proceed);
    } else if (
      timelineData?.status == TenantStatusEnum.completed ||
      timelineData?.steps?.[currentStep - 1].status == TenantStatusEnum.ongoing
    ) {
      setButtonContent(ButtonContentEnum.saveTenant);
    } else {
      setButtonContent(ButtonContentEnum.proceed);
    }
  }, []);

  return (
    <div
      className={`${
        userStore.role == UserRoleEnum.viewer ? "hidden" : "flex"
      } bg-background border-t-1 border-surface px-5 py-4 sticky z-10 bottom-0 left-0 right-0 rounded-2xl ${className}`}
    >
      {startContent && startContent}
      <Button
        className="min-h-10 w-full"
        type={buttonType}
        color="primary"
        variant={"shadow"}
        size={"md"}
        onClick={() => onClick?.()}
        isLoading={loading}
      >
        {buttonContent}
      </Button>

      {endContent && endContent}
    </div>
  );
};

export default ProceedButton;
