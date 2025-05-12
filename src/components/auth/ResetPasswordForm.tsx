import { useState } from "react";
import { FaAt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import XiscardPrimaryBtn from "../utils/btns/XiscardPrimaryBtn";
import XiscardPasswordInput from "../utils/forms/XiscardPasswordInput";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReset = async () => {
    const error = await resetPassword(email);
    if(error){
        setError(error);
    }else{
        setSucess("Reset email sent! Check your inbox.");
    }
  };

  const handleGoBack = () => {
    navigate("/sign-in")
  }
  
  return (
    <form className="w-full max-w-xs mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-[#13274F] mb-5">Reset Password</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {sucess && <p className="text-green-500 text-sm mb-3">{sucess}</p>}

      {/* Email input */}
      <div className="relative w-full mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <FaAt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <button onClick={handleGoBack} className="mt-4 text-blue-600 hover:underline">Go back</button>

      <XiscardPrimaryBtn
        text="Send Email"
        className="w-full mt-2"
        onClick={handleReset}
      />
    </form>
  );
};

export default ResetPasswordForm;
