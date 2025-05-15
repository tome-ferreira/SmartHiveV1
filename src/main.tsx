import './index.css'

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import LandingPage from './pages/UnauthorizedGroup/LandingPage';
import AuthPage from './pages/UnauthorizedGroup/Auth/AuthPage';
import UnauthorizedGroup from './page-groups/Unauthorized';
import VerifyEmailPage from './pages/UnauthorizedGroup/Auth/VerifyEmailPage';
import ClientGroup from './page-groups/Client';
import UserDashboard from './pages/ClientGroup/UserDashboard';
import ResetPasswordPage from './pages/UnauthorizedGroup/Auth/ResetPasswordPage';
import UpdatePasswordPage from './pages/UnauthorizedGroup/Auth/UpdatePasswordPage';
import AuthorizedGroup from './page-groups/Authorized';
import UnauthorizedRole from './pages/AuthorizedGroup/UnauthorizedRole';
import AdminGroup from './page-groups/Admin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminGroup/AdminDashboard';
import ClientLayout from './layouts/ClientLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import ManageUsers from './pages/AdminGroup/ManageUsers';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    Component: UnauthorizedGroup,
    children: [
      {
        path: '/',
        Component: LandingPage
      },
      {
        path: '/sign-in',
        Component: AuthPage,
      },
      {
        path: '/verify-email',
        Component: VerifyEmailPage
      },
      {
        path: '/reset-password',
        Component: ResetPasswordPage
      },
      {
        path: '/update-password',
        Component: UpdatePasswordPage
      },
    ],
    
  },
  {
    Component: AuthorizedGroup,
    children: [
      {
        path: '/unauthorized-role',
        Component: UnauthorizedRole
      }
    ]
  },
  {
    Component: AdminGroup,
    children: [
      {
        path: '/Admin',
        Component: AdminLayout,
        children: [
          {
            path: '/Admin/Dashboard',
            Component: AdminDashboard
          },
          {
            path: '/Admin/ManageUsers',
            Component: ManageUsers
          }
        ]
      },
    ]
  },
  {
    Component: ClientGroup,
    children: [
      {
        path: '/Client',
        Component: ClientLayout,
        children: [
          {
            path: '/Client/Dashboard',
            Component: UserDashboard,
          },
        ],
      },
    ],
  }
]);

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  </ThemeProvider>,
);
