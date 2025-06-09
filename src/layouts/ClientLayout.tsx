import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../contexts/SessionContext';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { smartHiveMainTheme } from '../services/themeService';
import { Navigation } from '@toolpad/core';
import DashboardIcon from '@mui/icons-material/Dashboard';

const NAVIGATION: Navigation = [
  {
    segment: 'Client/Dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  }
];

export default function ClientLayout() {
  const location = useLocation();

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="/img/logos/SmartHiveLogoHor.png" alt="Smart Hive logo" />,
        title: '',
        homeUrl: '/',
      }}
      theme={smartHiveMainTheme}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}
  