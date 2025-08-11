// providers/AuthProvider.tsx
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../hooks/axiosInstance';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';
import { getToken, clearAuthData } from '../functions/auth/service';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const storedUserData = localStorage.getItem('user-id');
      const user_id = storedUserData ? JSON.parse(storedUserData)?.user_id : null;

      if (!user_id) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/api/sign-in/check-user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      });

      if (response.status === 401) {
        // clearAuthData();
        setUser(null);
        router.push('/authentication/sign-in');
        return;
      }

      if (response.status === 403) {
        // Forbidden - user ID mismatch
        console.error('User ID mismatch between token and request');
        setUser(null);
        return;
      }

      if (!response.data?.user) {
        throw new Error('Invalid user data in response');
      }

      setUser(response.data.user);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);

      // If it's an authentication error, clear auth data
      if (axiosInstance.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          clearAuthData();
          router.push('/authentication/sign-in');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>{children}</AuthContext.Provider>;
};
