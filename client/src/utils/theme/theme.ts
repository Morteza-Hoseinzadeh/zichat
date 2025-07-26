import { createTheme } from '@mui/material/styles';

const baseThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "'Vazirmatn', sans-serif",
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#8950F7',
      light: '#9b59b6',
      dark: '#4b0082',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e90ff',
      light: '#63b3ed',
      dark: '#0b60d1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#4b0082',
    },
    divider: '#cccccc',
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8950F7',
      light: '#ba7fdc',
      dark: '#6a0dad',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e90ff',
      light: '#5eaaff',
      dark: '#187bcd',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#c5a3ff',
    },
    divider: '#3c3c3c',
  },
});
