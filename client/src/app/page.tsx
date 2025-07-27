'use client';

import SideBar from '@/components/sidebar/sidebar';
import { useThemeMode } from '@/utils/hooks/useThemeMode';
import { Box } from '@mui/material';
import React from 'react';

export default function page() {
  const { toggleTheme, isDarkMode } = useThemeMode();
  return (
    <Box>
      <SideBar />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </Box>
  );
}
