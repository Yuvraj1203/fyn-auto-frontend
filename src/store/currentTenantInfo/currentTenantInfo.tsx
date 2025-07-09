import { GetTenantIdByNameModel } from "@/services/models";
import { create } from "zustand";

type TenantInfo = GetTenantIdByNameModel;

type CurrentTenantInfoStore = {
  currentTenantInfo: TenantInfo;
  setCurrentTenantInfo: (value: TenantInfo) => void;
};

const useCurrentTenantInfoStore = create<CurrentTenantInfoStore>((set) => ({
  currentTenantInfo: {},
  setCurrentTenantInfo: (value) => set({ currentTenantInfo: value }),
}));

export default useCurrentTenantInfoStore;
