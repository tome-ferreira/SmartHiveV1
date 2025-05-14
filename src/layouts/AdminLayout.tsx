import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
