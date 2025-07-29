import { ThemeColorSet } from "@/components/pages/themeGenerator/ThemeGenerator";

export type TenantFormDataType = {
  id?: string;
  apiUrl?: string;
  appName?: string;
  auth0ClientId?: string;
  auth0Domain?: string;
  bundleId?: string;
  packageName?: string;
  sentryDsn?: string;
  tenancyName?: string;
  tenantId?: string;
  auth0Organization?: string | undefined;
  oktaClientId?: string | undefined;
  oktaDomain?: string | undefined;
};

type fileConfigsType = {
  googleServiceInfoPlist: string;
  googleServicesJson: string;
  firebaseAdminsdkJson: string;
  message?: string;
  success?: boolean;
};

export type ThemeColorsType = {
  light?: ThemeColorSet;
  dark?: ThemeColorSet;
  id?: string;
  message?: string;
};

export type SetTenantInfoModel = {
  id?: string;
  message: string;
  uploaded?: string[];
  tenantFormData?: TenantFormDataType;
  fileConfigsData?: fileConfigsType;
  themeColors?: ThemeColorsType;
};
