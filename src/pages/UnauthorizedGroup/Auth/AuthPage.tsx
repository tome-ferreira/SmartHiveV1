import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import LoginForm from "../../../components/auth/LoginForm";
import RegisterForm from "../../../components/auth/RegisterForm";
import { FcGoogle } from "react-icons/fc";
import XiscardOutlineBtn from "../../../components/utils/btns/XiscardOutlineBtn";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithGoogle, user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const returnUrl = searchParams.get("returnUrl") || "/UserDashboard";

  if(user){
    navigate(returnUrl);
  }

  const handleGoogleLogin = async () => {
    try {
      // Store returnUrl before redirect
      localStorage.setItem("returnUrl", returnUrl);
      
      await signInWithGoogle(); // This might redirect to Google
      // On return, it should reach your auth handler and then continue here (if pop-up based)
      
      // If using redirect mode, the next block might not execute until page reload
      navigate(returnUrl);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center xiscard-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-[#011134] p-8 rounded-lg shadow-lg w-full text-center">
          <img src="\img\logos\xiscard-big-logo-no-shadow.png" alt="Xiscard Logo" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
          {isLogin ? (
            <LoginForm returnUrl={returnUrl} />
          ) : (
            <RegisterForm returnUrl={returnUrl} />
          )}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-blue-600 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>

          <hr className="my-6" />

          <XiscardOutlineBtn
            text="Continue with Google"
            icon={<FcGoogle />}
            className="px-4 py-2 mx-auto"
            onClick={handleGoogleLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
