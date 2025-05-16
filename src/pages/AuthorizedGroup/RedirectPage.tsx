import { useNavigate } from "react-router";
import SmartHiveLoadingSplash from "../../components/utils/loading/SmartHiveLoadingSplash"
import { useAuth } from "../../contexts/AuthContext";
import { useGetUserRoleHook } from "../../hooks/AuthHooks";

export const RedirectPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: role, isLoading, error } = useGetUserRoleHook(user?.id as string);

    if(role === "Admin"){
        navigate(`/Admin/Dashboard`);
    }

    if(role === "User"){
        navigate(`/Client/Dashboard`);
    }

    return <SmartHiveLoadingSplash />
}