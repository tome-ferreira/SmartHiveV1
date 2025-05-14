import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
  

  useEffect(() => {
    if (loading) return; 

    const returnUrl = encodeURIComponent(location.pathname + location.search);
    if (!user) {
      navigate(`/sign-in?returnUrl=${returnUrl}`, { replace: true });
    } else if (!user.email_confirmed_at) {
      navigate(`/verify-email?returnUrl=${returnUrl}`, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading || !user) return null;

  return <>{children}</>;
};


export default AuthGuard;
