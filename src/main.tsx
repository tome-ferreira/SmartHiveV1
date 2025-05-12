import './index.css'

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './layouts/dashboard';
import LandingPage from './pages/UnauthorizedGroup/LandingPage';
import AuthPage from './pages/UnauthorizedGroup/Auth/AuthPage';
import UnauthorizedGroup from './page-groups/Unauthorized';
import VerifyEmailPage from './pages/UnauthorizedGroup/Auth/VerifyEmailPage';
import ClientGroup from './page-groups/Client';
import UserDashboard from './pages/ClientGroup/UserDashboard';
import ResetPasswordPage from './pages/UnauthorizedGroup/Auth/ResetPasswordPage';
import UpdatePasswordPage from './pages/UnauthorizedGroup/Auth/UpdatePasswordPage';


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
    Component: ClientGroup,
    children: [
      {
        path: '/UserDashboard',
        Component: UserDashboard
      },
      {
        path: '/App',
        Component: Layout,
        children: [
          {
            path: '/App/Dashboard',
            Component: UserDashboard,
          },
        ],
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
