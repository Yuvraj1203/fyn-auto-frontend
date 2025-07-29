import { colors } from "@/components/pages/themeGenerator/ThemeGenerator";
import { TenantFormDataType } from "@/services/models";
import { ThemeColorsType } from "@/services/models/setTenantInfoModel/setTenantInfoModel";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TenantDataStoreType = {
  tenantFormInfo: TenantFormDataType;
  setTenantFormInfo: (value: TenantFormDataType) => void;
  filesConfig: File[];
  setFilesConfig: (value: File[]) => void;
  themeColors: ThemeColorsType;
  setThemeColors: (value: ThemeColorsType) => void;
};

const useTenantDataStore = create<TenantDataStoreType>()(
  persist(
    (set) => ({
      tenantFormInfo: {},
      setTenantFormInfo: (value: TenantFormDataType) =>
        set({ tenantFormInfo: value }),
      filesConfig: [],
      setFilesConfig: (value: File[]) => set({ filesConfig: value }),
      themeColors: colors,
      setThemeColors: (value: ThemeColorsType) => set({ themeColors: value }),
    }),
    {
      name: "tenant-data-store",
      partialize: (state) => ({
        tenantFormInfo: state.tenantFormInfo,
        filesConfig: state.filesConfig,
        themeColors: state.themeColors,
      }),
    }
  )
);

export default useTenantDataStore;
