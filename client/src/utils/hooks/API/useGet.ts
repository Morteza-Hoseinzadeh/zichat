import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useGet = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint);
      setData(response.data);
    } catch (err: any) {
      setError('خطایی در هنگام ارسال اطلاعات رخ داده است لطفا مجدداً تلاش نمایید.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useGet;
