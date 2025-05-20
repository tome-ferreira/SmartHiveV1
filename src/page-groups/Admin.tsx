import { Outlet } from 'react-router';
import { useMemo } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../guards/AuthGuard';
import AdminGuard from '../guards/AdminGuard';

export default function AdminGroup() {
  return (
    <AuthProvider>
      <AuthGuard>
        <AdminGuard>
          <Outlet />
        </AdminGuard>
      </AuthGuard>
    </AuthProvider>
  );
}
