import { useState } from 'react';
import { AxiosResponse } from 'axios';

const useApiRequest = <TData, TError = string[]>() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError| null>(null);

  const makeRequest = async (request : ()=>Promise<AxiosResponse<TData>>) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await request();
      setData(response.data);
      return response.data; 
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, makeRequest };
};

export default useApiRequest;
