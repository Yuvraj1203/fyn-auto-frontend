import { TenantFormDataType } from "@/services/models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TenantDataStoreType = {
  tenantFormInfo: TenantFormDataType;
  setTenantFormInfo: (value: TenantFormDataType) => void;
  filesConfig: File[];
  setFilesConfig: (value: File[]) => void;
};

const useTenantDataStore = create<TenantDataStoreType>()(
  persist(
    (set) => ({
      tenantFormInfo: {},
      setTenantFormInfo: (value: TenantFormDataType) =>
        set({ tenantFormInfo: value }),
      filesConfig: [],
      setFilesConfig: (value: File[]) => set({ filesConfig: value }),
    }),
    {
      name: "tenant-data-store",
      partialize: (state) => ({
        tenantFormInfo: state.tenantFormInfo,
        filesConfig: state.filesConfig,
      }),
    }
  )
);

export default useTenantDataStore;
