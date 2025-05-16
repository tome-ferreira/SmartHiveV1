import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsClientHook } from '../hooks/AuthHooks';
import SmartHiveLoadingSplash from '../components/utils/loading/SmartHiveLoadingSplash';

interface ClientGuardProps {
  children: React.ReactNode;
}

const ClientGuard = ({ children }: ClientGuardProps) => {
  var ischecked = false;

  if(ischecked === false){
    const { data: isClient, isLoading } = useIsClientHook();

    if (isLoading) {
      return <SmartHiveLoadingSplash/>; 
    }

    if (!isClient) {
      return <Navigate to="/unauthorized-role" />; 
    }

    ischecked = true
  }

  return <>{children}</>;
};

export default ClientGuard;
