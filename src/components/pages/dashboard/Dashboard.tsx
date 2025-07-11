"use client";
import { CloseCircle, TickCircle } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import useCurrentTenantInfoStore from "@/store/currentTenantInfo/currentTenantInfo";
import { showSnackbar } from "@/utils/utils";
import { Button, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import TenantTable from "./TenantTable";

function Dashboard() {
  const router = useRouter();

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

  return (
    <div className="overflow-auto customScrollbar grow w-full flex justify-center">
      <TenantTable />
      {tenancyData?.tenancyName?.toLowerCase() == inputValue.toLowerCase() && (
        <>
          <hr className="" />
          <div className=" flex flex-col grow md:gap-5 overflow-y-auto customScrollbar relative">
            <h2 className="p-5 heading4">Tenant Details</h2>
            <div className="px-5 pb-5 md:p-5 flex flex-wrap gap-2 md:gap-5 justify-between">
              {Object.entries(tenancyData).map(([key, value]) => {
                return (
                  <div className="text-sm" key={key}>
                    <strong className="font-medium">{key}:</strong>{" "}
                    {String(value)}
                  </div>
                );
              })}
            </div>
            <div className="bg-background border-t-1 mt-auto border-surface px-5 py-4 sticky z-10 bottom-0 left-0 right-0 rounded-2xl">
              <Button
                className=" min-h-10 w-full"
                type="submit"
                color="secondary"
                variant={"shadow"}
                size={"md"}
                onPress={() => {
                  router.push("/tenant-info");
                }}
              >
                {"Start Tenant Creation"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
