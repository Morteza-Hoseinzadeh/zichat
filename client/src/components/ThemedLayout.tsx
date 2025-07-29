import React from 'react';
import { ThemeProvider } from '@mui/material';
import { useThemeMode } from '@/utils/hooks/useThemeMode';
import DynamicMetadata from './DynamicMetaData';
import { usePathname } from 'next/navigation';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { theme } = useThemeMode();
  const pathname = usePathname();

  return (
    <>
      <DynamicMetadata />
      <ThemeProvider theme={theme}>
        <body style={{ backgroundColor: theme.palette.background.default }}>
          <main style={{ position: 'relative', zIndex: 1, margin: pathname.includes('/direct/pv/') ? '0' : '16px' }}>{children}</main>
        </body>
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
