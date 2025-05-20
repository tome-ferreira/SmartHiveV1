import { createTheme } from "@mui/material";

export const smartHiveMainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
            main: '#36916a',
            light: '#5fb98f',
            dark: '#256748',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f9a825',
            light: '#ffdd59',
            dark: '#c17900',
            contrastText: '#000000',
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
            main: '#36916a',
            light: '#5fb98f',
            dark: '#256748',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f9a825',
            light: '#ffdd59',
            dark: '#c17900',
            contrastText: '#000000',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
