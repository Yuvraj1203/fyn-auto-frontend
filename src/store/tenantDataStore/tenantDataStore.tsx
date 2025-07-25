import { TenantFormDataType } from "@/services/models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TenantDataStoreType = {
  tenantFormInfo: TenantFormDataType;
  setTenantFormInfo: (value: TenantFormDataType) => void;
};

const useTenantDataStore = create<TenantDataStoreType>()(
  persist(
    (set) => ({
      tenantFormInfo: {},
      setTenantFormInfo: (value: TenantFormDataType) =>
        set({ tenantFormInfo: value }),
    }),
    {
      name: "tenant-data-store",
      partialize: (state) => ({
        tenantFormInfo: state.tenantFormInfo,
      }),
    }
  )
);

export default useTenantDataStore;
