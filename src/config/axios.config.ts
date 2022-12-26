import React, { useCallback, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { usePrevious } from "../shared/components";

export function useApiService<T>(url: string | null, key: string | number | null = null): [T | null, Error | null] {
  const prevKey = usePrevious(key);
  const baseUrl = process.env.REACT_APP_API_URL;
  const [response, setResponse] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const requestUrl = `${baseUrl}${url}`;
      const res = await axios(requestUrl);
      setResponse(res.data);
    } catch (error) {
      setError(error);
    }
  }, [baseUrl, url]);

  useEffect(() => {
    if (key !== prevKey && url) {
      fetchData();
    }
  }, [fetchData, key, prevKey, url]);

  useEffect(() => {
    if (url) fetchData();
  }, [fetchData, url]);
  return [response, error];
}

const handleAxiosError = (error: AxiosError): void => {
  // Error Message Object
  const message = {
    body: 'Internal Server Error',
    request: '',
    status: 500
  };

  // Setup Error Message
  if (typeof error !== 'undefined' && error.hasOwnProperty('message')) {
    message.body = error.message;
  }

  if (typeof error.response !== 'undefined') {
    // Setup Generic Response Messages
    switch (error.response.status) {
      case 401:
        message.body = 'UnAuthorized';
        break;
      case 404:
        message.body = 'API Route is Missing or Undefined';
        break;
      case 405:
        message.body = 'API Route Method Not Allowed';
        break;
      case 422:
        break;
      case 500:
      default:
        message.body = 'Internal Server Error';
        break;
    }

    // Assign error status code
    if (error.response.status > 0) {
      message.status = error.response.status;
    }

    // Try to Use the Response Message
    if (
      error.hasOwnProperty('response') &&
      error.response.hasOwnProperty('data') &&
      error.response.data.hasOwnProperty('message') &&
      !!error.response.data.message.length
    ) {
      message.body = error.response.data.message;
    }
  }
  console.log(error);
  console.log(`XHR Error - ${message.status} (${message.body})`);
};

export default class AxiosGlobalConfig {
  public static setup(): void {
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        handleAxiosError(error);
        return Promise.reject(error);
      }
    );
  }
}
