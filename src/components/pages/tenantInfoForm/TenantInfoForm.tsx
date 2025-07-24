// app/components/MyZodForm.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTextInput } from "@/components/molecules";
import { addToast, Button } from "@heroui/react";
import { FormTextInputType } from "@/components/molecules/customTextInput/FormTextInput";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { ApiConstants } from "@/services/apiConstants";
import { json } from "stream/consumers";
import { GetTenantIdByNameModel, SetTenantInfoModel } from "@/services/models";
import { proceedStepsStatus, showSnackbar } from "@/utils/utils";
import useCurrentTenantInfoStore from "@/store/currentTenantInfoStore/currentTenantInfoStore";
import { ProceedButton } from "@/components/common";

type SelectedEnvironmentType = {
  key: number | string;
  label: string;
  ApiUrl: string;
};

const TenantInfoForm = () => {
  const currentTenantInfo = useCurrentTenantInfoStore().currentTenantInfo;
  const envDropDown = [
    {
      key: "dev",
      label: "Development",
      ApiUrl: "https://dev.fyndev.com/",
    },
    {
      key: "uat",
      label: "UAT",
      ApiUrl: "https://uat.fyndev.com/",
    },
    {
      key: "prod",
      label: "Production",
      ApiUrl: "https://prod.fyndev.com/",
    },
  ];

  /** Added by @Yuvraj 25-06-2025 -> loading state */
  const [loading, setLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    SelectedEnvironmentType | undefined
  >(envDropDown[0]);

  // Define Zod schema
  const schema = z.object({
    apiUrl: z.string().min(1, "Please select environment").trim(),
    appName: z.string().min(1, "App Name is required").trim(),
    auth0ClientId: z.string().min(3, "Auth0 ClientId is required").trim(),
    auth0Domain: z
      .string()
      .min(1, "Auth0 Domain is required")
      .trim()
      .regex(/.*auth0.com.*/, "Invalid Auth0 domain URL"),
    auth0Organization: z.string().trim().optional(),
    bundleId: z
      .string()
      .min(1, "Bundle Id is required")
      .trim()
      .regex(/^com\./, "Invalid Bundle Id"),
    oktaClientId: z.string().trim().optional(),
    oktaDomain: z.string().trim().optional(),
    packageName: z
      .string()
      .min(1, "Package Name is required")
      .trim()
      .regex(/^com\./, "Invalid Package Name"),
    sentryDsn: z.string().min(1, "Sentry Dsn is required").trim(),
    tenancyName: z.string().min(1, "Tenancy name is required").trim(),
    tenantId: z.string().min(1, "Tenant Id is required").trim(),
  });

  // Infer TypeScript type from Zod
  type FormSchema = z.infer<typeof schema>;

  // methods == {register,error,handleSubmit}
  const methods = useForm<FormSchema>({
    defaultValues: {
      apiUrl: selectedEnvironment?.ApiUrl,
      tenantId: currentTenantInfo.tenantId,
      tenancyName: currentTenantInfo.tenancyName,
    },
    resolver: zodResolver(schema),
  });

  const handleSelectItemChange = (value: string | number) => {
    const selectedEnv = envDropDown.find((item, index) => item.key == value);
    setSelectedEnvironment(selectedEnv);
    methods.setValue("apiUrl", selectedEnv?.ApiUrl!);
  };

  const onSubmit = (data: FormSchema) => {
    SetTenantInfoApi.mutate(data);
  };

  const handleProceed = () => {
    const stepsData = proceedStepsStatus(
      useCurrentTenantInfoStore.getState()?.currentTenantInfo?.steps!,
      useCurrentTenantInfoStore.getState()?.currentStep - 1
    );
    UpdateTenantStepApi.mutate({
      params: {
        tenantId:
          useCurrentTenantInfoStore.getState()?.currentTenantInfo.tenantId,
        step: stepsData.step,
      },
      data: stepsData.steps,
    });
  };

  //set tenant info api
  const SetTenantInfoApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<SetTenantInfoModel>({
        endpoint: ApiConstants.SetTenantInfo,
        method: HttpMethodApi.Post,
        data: sendData,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        showSnackbar(data.result.message, "success");
        handleProceed();
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  //update tenant steps
  const UpdateTenantStepApi = useMutation({
    mutationFn: (sendData: {
      params: Record<string, any>;
      data: Record<string, any>;
    }) => {
      return makeRequest<GetTenantIdByNameModel>({
        endpoint: ApiConstants.UpdateTenantStep,
        method: HttpMethodApi.Patch,
        params: sendData.params,
        data: sendData.data,
      });
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        useCurrentTenantInfoStore.getState().setCurrentTenantInfo(data.result);
        useCurrentTenantInfoStore.getState().setCurrentStep(data.result.step!);
      }
    },
    onError(error, variables, context) {
      showSnackbar(error.message, "danger");
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className=" overflow-y-auto relative customScrollbar"
      >
        <div className="flex flex-col p-5 gap-5">
          <FormTextInput
            name="apiUrl"
            label="Environment"
            type={FormTextInputType.select}
            displayKey={"label"}
            selectItems={envDropDown}
            selectedValue={selectedEnvironment}
            isRequired={true}
            handleSelectItemChange={handleSelectItemChange}
          />

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="tenantId"
              label="Tenant Id"
              isReadOnly={true}
              isRequired={true}
              containerStyle="md:w-1/2"
            />
            <FormTextInput name="appName" label="App Name" isRequired={true} />
            <FormTextInput
              name="tenancyName"
              isReadOnly={true}
              label="Tenancy Name"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="bundleId"
              label="Bundle Id"
              isRequired={true}
            />
            <FormTextInput
              name="packageName"
              label="Package Name"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="auth0ClientId"
              label="Auth0 ClientId"
              isRequired={true}
            />
            <FormTextInput
              name="auth0Domain"
              label="Auth0 Domain"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput
              name="auth0Organization"
              label="Auth0 Organization"
            />
            <FormTextInput
              name="sentryDsn"
              label="Sentry Dsn"
              isRequired={true}
            />
          </div>

          <div className="flex gap-5 max-md:flex-col">
            <FormTextInput name="oktaClientId" label="Okta ClientId" />
            <FormTextInput name="oktaDomain" label="Okta Domain" />
          </div>
        </div>

        <ProceedButton buttonType={"submit"} loading={loading} />
      </form>
    </FormProvider>
  );
};
// <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//   <div>
//     <label>Name:</label>
//     <input {...register("name")} className="border p-2 rounded w-full" />
//     {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//   </div>

//   <div>
//     <label>Email:</label>
//     <input {...register("email")} className="border p-2 rounded w-full" />
//     {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//   </div>

//   <FormTextInput<FormSchema>
//     name="age"
//     label="Age"
//     register={register}
//     errors={errors}
//   />

//   <button
//     type="submit"
//     className="bg-blue-600 text-white px-4 py-2 rounded"
//   >
//     Submit
//   </button>
// </form>

export default TenantInfoForm;
