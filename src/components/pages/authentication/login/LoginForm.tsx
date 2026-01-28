"use client";

import { FormTextInput } from "@/components/molecules";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { LoginModel } from "@/services/models";
import { showSnackbar } from "@/utils/utils";
import { Button, Checkbox } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";

const LoginForm = () => {
  const router = useRouter();

  const UserStore = useUserStore();
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    username: z.string().min(3, { message: "please input valid username" }),
    password: z
      .string()
      .min(4, { message: "Password should be strong and more than 3 digits" }),
  });

  // Infer TypeScript type from Zod
  type FormSchema = z.infer<typeof schema>;

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  //onSubmitting the form
  const onSubmit = (data: FormSchema) => {
    LoginApi.mutate(data);
  };

  const LoginApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<LoginModel>({
        endpoint: ApiConstants.Login,
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
        // handleProceed();
        Cookies.set("accessTokenFyn", data.result.accessToken);
        Cookies.set("refreshTokenFyn", data.result.refreshToken!);
        UserStore.setUser(data.result.user!);
        setTimeout(()=>{
          router.replace("/dashboard");
        },500)
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
        className="flex flex-col gap-5 overflow-visible relative customScrollbar"
      >
        <FormTextInput name="username" label="Username" containerStyle="" />
        <FormTextInput name="password" label="Password" containerStyle="" />

        <div className="flex items-center justify-between gap-3">
          <Checkbox
            classNames={{
              label: "text-xs md:text-sm font-medium text-outline",
            }}
          >
            {"Remember me"}
          </Checkbox>
          <span className="text-primary text-xs md:text-sm font-medium cursor-pointer">
            {"Forgot Password?"}
          </span>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          color="primary"
          className="w-full"
        >
          {"Sign in"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
