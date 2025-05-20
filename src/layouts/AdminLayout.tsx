import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { smartHiveMainTheme } from '../services/themeService';
import { Navigation } from '@toolpad/core';

/*Icons*/
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { BsFileEarmarkPersonFill } from "react-icons/bs";
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
  {
    segment: 'Admin/CostumerRecords',
    title: 'Manage Costumer Records',
    icon: <BsFileEarmarkPersonFill />,
  }
];


export default function AdminLayout() {
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
