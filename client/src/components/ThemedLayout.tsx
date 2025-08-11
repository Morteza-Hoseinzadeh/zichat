// app/layout.tsx
import React, { useEffect } from 'react';
import { Box, CircularProgress, ThemeProvider, Typography } from '@mui/material';
import { useThemeMode } from '@/utils/hooks/useThemeMode';
import DynamicMetadata from './DynamicMetaData';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/contexts/AuthContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

const publicRoutes = ['/authentication/sign-in', '/authentication/sign-up'];
const authRoutes = ['/authentication/sign-in', '/authentication/sign-up'];

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { theme } = useThemeMode();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // If on auth route and already logged in
    if (user && authRoutes.some((route) => pathname?.startsWith(route))) {
      router.push('/');
      return;
    }

    // If not on public route and not logged in
    if (!user && !publicRoutes.some((route) => pathname?.startsWith(route))) {
      sessionStorage.setItem('redirectUrl', pathname || '/');
      router.push('/authentication/sign-in');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <html lang="fa" dir="rtl">
        <body style={{ backgroundColor: theme.palette.background.default }}>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100vh'} flexDirection="column" gap={2}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        </body>
      </html>
    );
  }

  return (
    <html lang="fa" dir="rtl">
      <DynamicMetadata />
      <ThemeProvider theme={theme}>
        <body style={{ backgroundColor: theme.palette.background.default, margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, position: 'relative', zIndex: 1, margin: pathname?.includes('/direct/pv/') || pathname?.includes('/authentication/sign-in') ? '0' : '16px' }}>{children}</main>
        </body>
      </ThemeProvider>
    </html>
  );
};

export default RootLayout;
