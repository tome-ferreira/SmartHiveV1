import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";

const UserDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <>
          <h1 className="text-2xl font-bold mb-4">Hello, you're authenticated!</h1>
            {user ? (
              <>
                <p><strong>Email:</strong> {user.user_metadata.display_name}</p>
              </>
            ) : (
              <p>Loading user info...</p>
            )}

        <SmartHivePrimaryBtn text="Log-out" onClick={signOut} />
    </>
  );
};

export default UserDashboard;
