import { clearAuthData, getToken } from '@/utils/functions/auth/service';
import { createContext, useCallback, useEffect, useState } from 'react';
import axiosInstance from '../hooks/axiosInstance';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const storedUserData = localStorage.getItem('user-id');
      let user_id: string | null = null;

      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          user_id = parsed?.user_id || null;
        } catch {
          console.error('Invalid data in localStorage for key "user-id"');
        }
      }

      if (!user_id) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/api/sign-in/check-user/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error checking user:', error);
      clearAuthData();
      router.push('/authentication/sign-in');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>{children}</AuthContext.Provider>;
};
