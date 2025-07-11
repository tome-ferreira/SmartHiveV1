import { Outlet, useNavigate } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../guards/AuthGuard';
import ClientGuard from '../guards/ClientGuard';


export default function ClientGroup() {
  return (
    <AuthProvider>
        <AuthGuard>
            <ClientGuard>
              <Outlet />   
            </ClientGuard>
        </AuthGuard>  
    </AuthProvider>
  );
}
