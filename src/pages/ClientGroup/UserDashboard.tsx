import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";
import { openCustomerPortal } from "../../edge-functions-triggers/open_costummer_portal_trigger";

const UserDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Hello {user?.user_metadata.display_name}!</h1>

      <SmartHivePrimaryBtn text="Log-out" onClick={signOut} />

      <SmartHivePrimaryBtn text="Costumer portal" onClick={() => openCustomerPortal(user?.id || "")} className="mt-3"/>
    </>
  );
};

export default UserDashboard;
