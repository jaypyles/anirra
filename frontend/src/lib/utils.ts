import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { AxiosRequestConfig } from "axios";
import { nextApi } from "./api";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetch<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T | null> {
  try {
    const method = options?.method || "GET";
    const response: AxiosResponse<T> = await nextApi.request({
      url,
      method,
      ...options,
    });

    if (!response) {
      toast.error("No response received from server");
      return null;
    }

    if (response.status >= 400) {
      toast.error(`Error: ${response.statusText}`);
      return null;
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 307) {
        window.location.href = error.response.data.url;
        return null;
      } else {
        console.error(JSON.stringify(error.response?.data.error, null, 2));
      }
    }

    toast.error("An unexpected error occurred");
    return null;
  }
}

export const getJwt = async (req: NextApiRequest) => {
  return await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
};
