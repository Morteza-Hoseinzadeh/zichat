import { createTheme } from '@mui/material/styles';

const baseThemeOptions = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  typography: {
    fontFamily: `yekanbakh`,
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#A970FF', // Electric Purple
      light: '#C084FC',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00FFAA', // Neon Green
      light: '#5CFFCC',
      dark: '#00CC88',
      contrastText: '#000000',
    },
    background: {
      default: '#F8F8FF', // Mint White
      paper: '#D4E5FF', // Soft Sky
    },
    text: {
      primary: '#1E1E2F', // Midnight
      secondary: '#A970FF',
    },
    divider: '#CCCCCC',
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#A970FF', // Electric Purple
      light: '#C084FC',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00FFAA', // Neon Green
      light: '#5CFFCC',
      dark: '#00CC88',
      contrastText: '#000000',
    },
    background: {
      default: '#1E1E2F', // Midnight Blue
      paper: '#2A2A3C', // Slightly lighter than Midnight
    },
    text: {
      primary: '#F8F8FF', // Mint White
      secondary: '#A970FF',
    },
    divider: '#3C3C3C',
  },
});
