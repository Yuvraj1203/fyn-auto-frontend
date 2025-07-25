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

export type SetTenantInfoModel = {
  message: string;
  uploaded?: string[];
  tenantFormData?: TenantFormDataType;
};
