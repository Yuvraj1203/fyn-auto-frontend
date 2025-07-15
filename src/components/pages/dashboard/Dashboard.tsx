"use client";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import TenantTable from "./TenantTable";
import { showSnackbar } from "@/utils/utils";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [allTenants, setAllTenants] = useState<GetTenantIdByNameModel[]>([]);

  useEffect(() => {
    getAllTenants();
  }, []);

  const getAllTenants = () => {
    !GetAllTenantsApi.isPending && GetAllTenantsApi.mutate({});
  };

  const handleDeleteTenant = (tenantId: string) => {
    RemoveTenantApi.mutate({ tenantId: tenantId });
  };

  const GetAllTenantsApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<GetTenantIdByNameModel[]>({
        endpoint: ApiConstants.GetAllTenants,
        method: HttpMethodApi.Get,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      setLoading(true);
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        setAllTenants(data.result);
        console.log(data.result);
      }
    },
    onError(error, variables, context) {
      setAllTenants([]);
    },
  });

  const RemoveTenantApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<{ message: string }>({
        endpoint: ApiConstants.RemoveTenant,
        method: HttpMethodApi.Delete,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      // setLoading(true);
    },
    onSettled(data, error, variables, context) {
      // setLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        getAllTenants();
        showSnackbar(data.result.message, "success");
      }
    },
    onError(error, variables, context) {
      showSnackbar("Unable to remove tenant", "warning");
    },
  });

  return (
    <div className="overflow-auto customScrollbar grow w-full flex justify-center">
      <TenantTable
        allTenants={allTenants}
        getAllTenants={getAllTenants}
        handleDeleteTenant={handleDeleteTenant}
      />
    </div>
  );
}

export default Dashboard;
