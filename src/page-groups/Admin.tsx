import { Outlet } from 'react-router';
import { useMemo } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../guards/AuthGuard';
import AdminGuard from '../guards/AdminGuard';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import { createTheme } from '@mui/material';

/*Icons*/
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
/*******/

const NAVIGATION: Navigation = [
  {
    segment: 'Admin/Dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'header',
    title: 'User management',
  },
  {
    segment: 'Admin/ManageUsers',
    title: 'Manage users',
    icon: <PeopleAltIcon />,
  },
];

const BRANDING = {
  logoUrl: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
  title: 'Smart Hive',
};

const getCustomTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
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
        default: mode === 'dark' ? '#121212' : '#f9f9f9',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    shape: {
      borderRadius: 8,
    },
  });

export default function AdminGroup() {
  const theme = getCustomTheme("light");
  //const theme = (mode: 'light' | 'dark') => getCustomTheme(mode);

  return (
    <AuthProvider>
      <AuthGuard>
        <AdminGuard>
          <ReactRouterAppProvider
            navigation={NAVIGATION}
            branding={{
              logo: <img src="/img/logos/SmartHiveLogoHor.png" alt="Smart Hive logo" />,
              title: '',
              homeUrl: '/',
            }}
            theme={theme}
          >
            <Outlet />
          </ReactRouterAppProvider>
        </AdminGuard>
      </AuthGuard>
    </AuthProvider>
  );
}
