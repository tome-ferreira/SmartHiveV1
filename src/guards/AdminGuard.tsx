import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAdminHook } from '../hooks/AuthHooks';
import SmartHiveLoadingSplash from '../components/utils/loading/SmartHiveLoadingSplash';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  var ischecked = false;

  if(ischecked === false){
    const { data: isAdmin, isLoading } = useIsAdminHook();

    if (isLoading) {
      return <SmartHiveLoadingSplash/>; 
    }

    if (!isAdmin) {
      return <Navigate to="/unauthorized-role" />; 
    }

    ischecked = true
  }

  return <>{children}</>;
};

export default AdminGuard;
