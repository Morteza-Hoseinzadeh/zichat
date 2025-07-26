import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode, toggleThemeMode } from '@/utils/toolkit/themeSlice';
import { lightTheme, darkTheme } from '@/utils/theme/theme';

export const useThemeMode = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  // Optional: persist in localStorage
  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      dispatch(setThemeMode(savedMode === 'dark'));
    }
  }, [dispatch]);

  React.useEffect(() => {
    localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    dispatch(toggleThemeMode());
  };

  return { isDarkMode, theme, toggleTheme };
};
