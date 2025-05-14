import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="bg-[#f0f9f4] p-8 rounded-lg shadow-lg text-center">
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
    </div>
  );
};

export default AdminDashboard;
