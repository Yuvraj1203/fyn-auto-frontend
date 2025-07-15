import { GetTenantIdByNameModel } from "@/services/models";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { create } from "zustand";

type TenantInfo = GetTenantIdByNameModel;

type CurrentTenantInfoStore = {
  currentTenantInfo: TenantInfo;
  currentStep: number;
  setCurrentTenantInfo: (value: TenantInfo) => void;
  setCurrentStep: (step: number) => void;
};

const useCurrentTenantInfoStore = create<CurrentTenantInfoStore>((set) => ({
  currentTenantInfo: {},
  currentStep: 1,
  setCurrentTenantInfo: (value) =>
    set(() => {
      const stepId =
        value.steps?.find((item) => item.status === TenantStatusEnum.ongoing)
          ?.id || 1;

      return {
        currentTenantInfo: value,
        currentStep: stepId,
      };
    }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useCurrentTenantInfoStore;
