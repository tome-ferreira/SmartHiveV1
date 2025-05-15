import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hello, you're authenticated!</h1>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}

      <SmartHivePrimaryBtn text="Log-out" onClick={signOut} />
    </div>
  );
};

export default AdminDashboard;
