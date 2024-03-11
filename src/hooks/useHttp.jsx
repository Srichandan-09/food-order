import { useState, useEffect, useCallback } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong. Failed to send request!"
    );
  }

  return resData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(configData) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, {
          ...config,
          body: configData,
        });
        setData(resData);
      } catch (err) {
        setError(err.message) || "Something went wrong";
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if (!config || (config && (config.method === "GET" || !config.method))) {
      sendRequest();
    }
  }, [sendRequest, config]);

  console.log();

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  };
}
