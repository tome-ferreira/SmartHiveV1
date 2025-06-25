import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Hello {user?.user_metadata.full_name || user?.email}!</h1>

      <SmartHivePrimaryBtn text="Log-out" onClick={signOut} />
    </>
  );
};

export default AdminDashboard;
