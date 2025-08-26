"use client";
import { CloseCircle, TickCircle } from "@/public";
import { ApiConstants } from "@/services/apiConstants";
import { HttpMethodApi, makeRequest } from "@/services/apiInstance";
import { GetTenantIdByNameModel } from "@/services/models";
import { useCurrentTenantInfoStore } from "@/store";
import { showSnackbar } from "@/utils/utils";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { PlusIcon } from "./TenantTable";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";

type FetchDetailsProps = {
  getAllTenants: () => void;
};

const FetchDetails = ({ getAllTenants }: FetchDetailsProps) => {
  const currentTenantInfo = useCurrentTenantInfoStore();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [tenancyData, setTenancyData] = useState<GetTenantIdByNameModel>({});
  const [animate, setAnimate] = useState("scale-0");
  const buttonIconRef = useRef<"correct" | "wrong" | null>(null);
  const addButtonRef = useRef<"inserted" | null>(null);

  useEffect(() => {
    if (buttonIconRef.current) {
      setAnimate("scale-100");
      setTimeout(() => (buttonIconRef.current = null), 3000);
    }
  }, [buttonIconRef.current]);

  const handleTenancyCheck = () => {
    if (inputValue.trim().length > 0) {
      setAnimate("scale-0");
      GetTenantIdByNameApi.mutate({ tenancyName: inputValue.trim() });
    }
  };

  const handleTenantAddClick = () => {
    AddTenantApi.mutate({
      ...tenancyData,
      status: TenantStatusEnum.pending,
    });
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
      addButtonRef.current = null;
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
      showSnackbar(error.message, "danger");
    },
  });

  //api for addning tenant
  const AddTenantApi = useMutation({
    mutationFn: (sendData: Record<string, any>) => {
      return makeRequest<{ message: string }>({
        endpoint: ApiConstants.AddTenant,
        method: HttpMethodApi.Post,
        data: sendData,
      }); // API Call
    },
    onMutate(variables) {
      setAddLoading(true);
    },
    onSettled(data, error, variables, context) {
      setAddLoading(false);
    },
    onSuccess(data, variables, context) {
      if (data.result) {
        showSnackbar(data.result.message, "success");
        addButtonRef.current = "inserted";
        getAllTenants();
      }
    },
    onError(error, variables, context) {
      showSnackbar("Unable to add tenant", "danger");
      addButtonRef.current = null;
    },
  });

  const TenantTable = () => {
    return (
      <Table removeWrapper aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>{"Tenant Id"}</TableColumn>
          <TableColumn>{"Tenancy Name"}</TableColumn>
          <TableColumn>{"Tenant Name"}</TableColumn>
          <TableColumn>{"Action"}</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>{tenancyData.tenantId}</TableCell>
            <TableCell>{tenancyData.tenancyName}</TableCell>
            <TableCell>{tenancyData.tenantName}</TableCell>
            <TableCell>
              <Tooltip content="Add Tenant">
                {addLoading ? (
                  <Spinner />
                ) : (
                  <span
                    onClick={() => {
                      !addButtonRef.current && handleTenantAddClick();
                    }}
                    className="text-lg font-bold cursor-pointer active:opacity-50 text-success"
                  >
                    {addButtonRef.current == "inserted" ? (
                      <TickCircle />
                    ) : (
                      <PlusIcon />
                    )}
                  </span>
                )}
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <>
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
            buttonIconRef.current &&
            !addButtonRef.current && (
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
      {tenancyData.tenancyName?.toLowerCase() == inputValue.toLowerCase() && (
        <TenantTable />
      )}
    </>
  );
};

export default FetchDetails;
