"use client";

import { FormTextInput } from "@/components/molecules";
import { Button, Checkbox } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const LoginForm = () => {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
  });

  // Infer TypeScript type from Zod
  type FormSchema = z.infer<typeof schema>;

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  //onSubmitting the form
  const onSubmit = () => {};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 overflow-visible relative customScrollbar"
      >
        <FormTextInput name="username" label="Username" containerStyle="" />
        <FormTextInput name="password" label="Password" containerStyle="" />

        <div className="flex items-center justify-between">
          <Checkbox
            classNames={{
              label: "text-sm font-medium text-outline",
            }}
          >
            {"Remember me"}
          </Checkbox>
          <span className="text-primary text-sm font-medium cursor-pointer">
            {"Forgot Password?"}
          </span>
        </div>

        <Button color="primary" className="w-full">
          {"Sign in"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
