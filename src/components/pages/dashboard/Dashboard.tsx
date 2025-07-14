"use client";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import TenantTable from "./TenantTable";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [allTenants, setAllTenants] = useState<GetTenantIdByNameModel[]>([]);

  useEffect(() => {
    getAllTenants();
  }, []);

  const getAllTenants = () => {
    !GetAllTenantsApi.isPending && GetAllTenantsApi.mutate({});
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

  return (
    <div className="overflow-auto customScrollbar grow w-full flex justify-center">
      <TenantTable allTenants={allTenants} getAllTenants={getAllTenants} />
    </div>
  );
}

export default Dashboard;
