"use client";
import { CustomModal } from "@/components/molecules";
import { CloseCircle, TickCircle } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models";
import { useCurrentTenantInfoStore } from "@/store";
import { showSnackbar } from "@/utils/utils";
import { Button, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

const DashHeader = () => {
  const currentTenantInfo = useCurrentTenantInfoStore();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tenancyData, setTenancyData] = useState<GetTenantIdByNameModel>({});
  const [animate, setAnimate] = useState("scale-0");
  const buttonIconRef = useRef<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (buttonIconRef.current) {
      setAnimate("scale-100");
      setTimeout(() => (buttonIconRef.current = null), 3000);
    }
  }, [buttonIconRef.current]);

  const handleTenancyCheck = () => {
    setAnimate("scale-0");
    GetTenantIdByNameApi.mutate({ tenancyName: inputValue });
  };

  const GetTenantIdByNameApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<GetTenantIdByNameModel>({
        endpoint: ApiConstants.GetTenantIdByName,
        method: HttpMethodApi.Get,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      buttonIconRef.current = null;
      setAnimate("scale-0");
      setIsLoading(true);
    },
    onSettled(data, error, variables, context) {
      setIsLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data?.result?.tenantId) {
        buttonIconRef.current = "correct";
        setTenancyData(data.result);
        currentTenantInfo.setCurrentTenantInfo(data.result);
      } else {
        setTenancyData({});
        showSnackbar("Invalid Tenancy Name", "danger");
        buttonIconRef.current = "wrong";
      }
    },
    onError(error, variables, context) {
      buttonIconRef.current = "wrong";
      setTenancyData({});
      showSnackbar("Invalid Tenancy Name", "danger");
    },
  });

  const triggerButton = (
    <Button
      className="px-2 md:px-4"
      type="submit"
      color="secondary"
      variant={"shadow"}
      size={"md"}
      onPress={() => {
        // router.push("/tenant-info");
      }}
    >
      {"Add Tenant"}
    </Button>
  );

  const FetchDetails = () => {
    return (
      <div className="flex max-md:flex-col gap-5 items-center">
        <Input
          isRequired={true}
          label={"Tenancy Name"}
          type={"text"}
          variant={"flat"}
          size={"sm"}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleTenancyCheck();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          classNames={{
            inputWrapper:
              "bg-background data-[hover=true]:bg-background group-data-[focus=true]:bg-background !shadow-lightShadow",
          }}
          endContent={
            !isLoading &&
            buttonIconRef.current && (
              <span
                className={`transition-all duration-300 ease-in-out transform ${animate} ${
                  buttonIconRef.current === "correct"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {buttonIconRef.current === "correct" ? (
                  <TickCircle />
                ) : (
                  <CloseCircle />
                )}
              </span>
            )
          }
          spellCheck={"false"}
        />
        <Button
          className="min-h-10 w-full md:w-fit px-10"
          type="submit"
          color="primary"
          variant={"shadow"}
          size={"md"}
          isLoading={isLoading}
          onPress={handleTenancyCheck}
        >
          {"Check Tenant"}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center p-5">
      <h2 className="heading2 ">Tenant</h2>
      <CustomModal
        title="Add Tenant"
        content={<FetchDetails />}
        closeButton={false}
        trigger={triggerButton}
      />
    </div>
  );
};

export default DashHeader;
