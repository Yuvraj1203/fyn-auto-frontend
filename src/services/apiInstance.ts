import axios from "axios";
import { BaseModel } from "./models";

export enum HttpMethodApi {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete",
}

export type RequestOptions = {
  endpoint: string;
  method: HttpMethodApi;
  data?: Record<string, any> | FormData;
  headers?: Record<string, string>;
  withoutBaseModel?: boolean;
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5 * 60 * 1000,
});

export async function makeRequest<T>({
  endpoint,
  method,
  data,
  headers = {},
  withoutBaseModel = false,
}: RequestOptions): Promise<BaseModel<T>> {
  try {
    const isForm = data instanceof FormData;

    const response = await axiosClient.request({
      url: endpoint,
      method,
      headers: {
        ...headers,
        "Content-Type": isForm ? "multipart/form-data" : "application/json",
        Accept: "application/json",
      },
      ...(method === HttpMethodApi.Get ? { params: data } : { data }),
    });

    if (withoutBaseModel) {
      return response.data;
    }

    const result = response.data as BaseModel<T>;

    if (!result.success) {
      throw new Error(result.error_message || "Something went wrong");
    }

    return result;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

export async function makeRequestWithoutBaseUrl({
  endpoint,
  method,
  data,
  headers = {},
  withoutBaseModel = false,
}: RequestOptions) {
  const axiosInstance = axios.create({
    baseURL: endpoint,
    timeout: 1000,
  });

  const isForm = data instanceof FormData;

  const response = await axiosInstance.request({
    url: "",
    method,
    headers: {
      ...headers,
      "Content-Type": isForm ? "multipart/form-data" : "application/json",
      Accept: "application/json",
    },
    ...(method === HttpMethodApi.Get ? { params: data } : { data }),
  });

  return response.data;
}
