import { Outlet, useNavigate } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../guards/AuthGuard';


export default function AuthorizedGroup() {
  return (
    <AuthProvider>
        <AuthGuard>
            <Outlet />   
        </AuthGuard>  
    </AuthProvider>
  );
}
