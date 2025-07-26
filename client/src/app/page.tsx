'use client';

import React from 'react';
import { useThemeMode } from '@/utils/hooks/useThemeMode';

export default function page() {
  const { toggleTheme, isDarkMode } = useThemeMode();

  return (
    <div>
      <button onClick={toggleTheme}>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</button>
    </div>
  );
}
