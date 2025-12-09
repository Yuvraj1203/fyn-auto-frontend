import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

type SnackbarEnum =
  | "success"
  | "default"
  | "foreground"
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | undefined;

type Step = {
  id: number;
  label: string;
  status: TenantStatusEnum;
};

type UpdateStepsStatusReturn = {
  message: string;
  steps: Step[];
  step: number;
};

export const proceedStepsStatus = (
  steps: Step[],
  step: number,
  router: ReturnType<typeof useRouter>
): UpdateStepsStatusReturn => {
  const updatedSteps = [...steps];

  // Mark current ongoing step as completed
  updatedSteps[step].status = TenantStatusEnum.completed;

  //change onGoing to pending
  let anyOngoing = updatedSteps.findIndex(
    (s, index) => s.status === TenantStatusEnum.ongoing
  );

  if (anyOngoing > -1) {
    updatedSteps[anyOngoing].status = TenantStatusEnum.pending;
  }

  // Look for the next pending step *after* the current one
  let nextPendingIndex = updatedSteps.findIndex(
    (s, index) => index > step && s.status === TenantStatusEnum.pending
  );

  // If not found, cycle to first pending step
  if (nextPendingIndex === -1) {
    nextPendingIndex = updatedSteps.findIndex(
      (s) => s.status === TenantStatusEnum.pending
    );
  }

  if (nextPendingIndex === -1) {
    router.push("/");
    return { message: "All steps completed", steps: updatedSteps, step: 5 };
  }

  // Set next pending step to ongoing
  updatedSteps[nextPendingIndex].status = TenantStatusEnum.ongoing;
  return {
    message: "updation successful",
    steps: updatedSteps,
    step: nextPendingIndex + 1,
  };
};

export const showSnackbar = (
  msg: string,
  type: SnackbarEnum | undefined = "default",
  delay: number = 0,
  timeout: number = 1000
) => {
  addToast({
    title: msg,
    color: type,
    promise: new Promise((resolve) => setTimeout(resolve, delay)),
    timeout: timeout,
  });
};

export function base64ToFile(
  base64: string,
  fileName: string,
  mimeType: string
): File {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], fileName, { type: mimeType });
}
