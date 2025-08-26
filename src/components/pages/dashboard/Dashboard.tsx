"use client";
import { ApiConstants } from "@/services/apiConstants";
import {
  HttpMethodApi,
  makeFileRequest,
  makeRequest,
} from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import TenantTable from "./TenantTable";
import { showSnackbar } from "@/utils/utils";
import Cookies from "js-cookie";
import { Spinner } from "@heroui/react";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [allTenants, setAllTenants] = useState<GetTenantIdByNameModel[]>([]);
  const [downloadLoader, setDownloadLoader] = useState(false);

  useEffect(() => {
    Cookies.remove("currentTenant");
    getAllTenants();
  }, []);

  const getAllTenants = () => {
    if (!loading) {
      GetAllTenantsApi.mutate({});
    }
  };

  const handleDeleteTenant = (user: GetTenantIdByNameModel) => {
    RemoveTenantApi.mutate({
      tenantId: user.tenantId,
      tenancyName: user.tenancyName,
    });
  };

  const handleGetFolder = (user: GetTenantIdByNameModel) => {
    DownloadTenantFolderApi.mutate({
      tenantId: user.tenantId,
      tenancyName: user.tenancyName,
    });
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

  //get folder
  const DownloadTenantFolderApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeFileRequest({
        endpoint: ApiConstants.DownloadTenantFolder,
        method: HttpMethodApi.Get,
        headers: { Accept: "application/zip" },
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      setDownloadLoader(true);
    },
    onSettled(data, error, variables, context) {
      setDownloadLoader(false);
    },
    onSuccess(data, variables, context) {
      // data here is a Blob (the zip file)
      if (data instanceof Blob) {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;

        // you can also pick the tenancyName from variables
        a.download = `${variables.tenancyName || "tenant"}.zip`;

        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        showSnackbar("Invalid file received", "warning");
      }
    },
    onError(error, variables, context) {
      showSnackbar("Unable to Download Zip", "danger");
    },
  });

  return (
    <div className="relative overflow-clip customScrollbar grow w-full flex justify-center">
      <TenantTable
        allTenants={allTenants}
        getAllTenants={getAllTenants}
        handleDeleteTenant={handleDeleteTenant}
        handleGetFolder={handleGetFolder}
      />
      {downloadLoader && (
        <span className="absolute inset-0 bg-surface bg-opacity-45 grid place-content-center">
          <Spinner />
        </span>
      )}
    </div>
  );
}

export default Dashboard;
