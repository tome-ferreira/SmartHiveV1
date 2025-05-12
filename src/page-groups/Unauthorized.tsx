import { Outlet, useNavigate } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';


export default function UnauthorizedGroup() {
  return (
    <AuthProvider>
      <Outlet />     
    </AuthProvider>
  );
}
