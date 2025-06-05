import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../contexts/SessionContext';

export default function ClientLayout() {
  const location = useLocation();

  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
  