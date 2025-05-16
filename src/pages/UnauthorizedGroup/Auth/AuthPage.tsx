import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import LoginForm from "../../../components/auth/LoginForm";
import RegisterForm from "../../../components/auth/RegisterForm";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams, useNavigate } from "react-router-dom";
import SmartHiveOutlineBtn from "../../../components/utils/btns/SmartHiveOutlineBtn";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithGoogle, user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const returnUrl = searchParams.get("returnUrl") || "/redirect";

  if(user){
    navigate(returnUrl);
  }

  const handleGoogleLogin = async () => {
    try {
      localStorage.setItem("returnUrl", returnUrl);
      
      await signInWithGoogle(); 

      navigate(returnUrl);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-eucalyptus-950 p-8 rounded-lg shadow-lg w-full text-center">
          <img src="\img\logos\SmartHiveLogoHor.png" alt="SmartHive Logo" />
        </div>
        <div className="bg-[#f0f9f4] p-8 rounded-lg shadow-lg w-full text-center">
          {isLogin ? (
            <LoginForm returnUrl={returnUrl} />
          ) : (
            <RegisterForm returnUrl={returnUrl} />
          )}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-eucalyptus-500 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>

          <hr className="my-6" />

          <SmartHiveOutlineBtn
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
