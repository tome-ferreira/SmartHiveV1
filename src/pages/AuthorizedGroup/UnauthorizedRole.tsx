import XiscardPrimaryBtn from "../../components/utils/btns/XiscardPrimaryBtn";
import { useAuth } from "../../contexts/AuthContext";

const UnauthorizedRole = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center xiscard-grad-bg p-10">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Your role does not have acess to this page</h1>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}

        <XiscardPrimaryBtn text="Log-out" onClick={signOut} />
      </div>
    </div>
  );
};

export default UnauthorizedRole;
