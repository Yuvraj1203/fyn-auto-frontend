import { GetTenantIdByNameModel } from "@/services/models";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TenantInfo = GetTenantIdByNameModel;

type CurrentTenantInfoStore = {
  currentTenantInfo: TenantInfo;
  currentStep: number;
  setCurrentTenantInfo: (value: TenantInfo) => void;
  setCurrentStep: (step: number) => void;
};

const useCurrentTenantInfoStore = create<CurrentTenantInfoStore>()(
  persist(
    (set) => ({
      currentTenantInfo: {},
      currentStep: 1,
      setCurrentTenantInfo: (value) =>
        set(() => {
          const stepId =
            value.steps?.find(
              (item) => item.status === TenantStatusEnum.ongoing
            )?.id || 1;

          document.cookie = `currentTenantInfo=${JSON.stringify({
            ...value,
            stepId,
          })}; path=/`;

          return {
            currentTenantInfo: value,
            currentStep: stepId,
          };
        }),
      setCurrentStep: (step) => set({ currentStep: step }),
    }),
    {
      name: "current-tenant-info",
      partialize: (state) => ({
        currentTenantInfo: state.currentTenantInfo,
        currentStep: state.currentStep,
      }),
    }
  )
);

export default useCurrentTenantInfoStore;
