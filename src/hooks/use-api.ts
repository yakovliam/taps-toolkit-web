import { useEffect, useState } from "react";
import useEasyAuth from "./use-easy-auth";

type UseApiProps = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  includeToken?: boolean;
};

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const useApi = <T>({
  path,
  method,
  includeToken,
}: UseApiProps): T | undefined => {
  const [data, setData] = useState<T>();
  const { user } = useEasyAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(includeToken && {
            Authorization: `Bearer ${user?.access_token}`,
          }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    };

    fetchData();
  }, [path, method, includeToken, user]);

  return data;
};

export default useApi;
