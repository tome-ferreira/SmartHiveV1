import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import SmartHiveOutlineBtn from "../../../components/utils/btns/SmartHiveOutlineBtn";

const VerifyEmailPage = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = searchParams.get("returnUrl") || "/UserDashboard";
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
  const handleManualCheck = async () => {
    setChecking(true);
    const updated = await refreshUser();
    if (updated?.email_confirmed_at) {
      navigate(returnUrl);
    } else {
      setError("Your email is still not verified.");
    }
    setChecking(false);
  };*/

    

  const handleManualCheck = async () => {
    setChecking(true);
    navigate(returnUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-eucalyptus-950 p-8 rounded-lg shadow-lg w-full text-center">
          <img src="/img/logos/SmartHiveLogoHor.png" alt="SmartHive Logo" />
        </div>
        <div className="bg-[#f0f9f4] p-8 rounded-lg shadow-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Verify your email</h2>
          <p className="mb-4">
            We’ve sent a verification email to{" "}
            <span className="font-semibold">{user?.email}</span>.
            <br />
            Please check your inbox and click the link to verify.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This page will automatically continue once your email is verified.
          </p>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <SmartHiveOutlineBtn
            text={checking ? "Checking..." : "I’ve Verified My Email"}
            className="px-4 py-2 mx-auto"
            onClick={handleManualCheck}
            disabled={checking}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
