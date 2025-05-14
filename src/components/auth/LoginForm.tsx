import { useState } from "react";
import { FaAt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SmartHivePasswordInput from "../utils/forms/SmartHivePasswordInput";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";

const LoginForm = ({ returnUrl }: { returnUrl: string }) => {
  const { signInWithCredentials } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await signInWithCredentials(email, password);
    if (err) {
      setError(err);
    } else {
      navigate(returnUrl);
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password")
  }

  return (
    <div>
      <form onSubmit={handleLogin} className="w-full max-w-xs mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-[#13274F] mb-5">Log-in</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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

      
        {/* Password input */}
        <div className="relative w-full mb-4">
          <SmartHivePasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
        </div>

        

        <SmartHivePrimaryBtn
          text="LOG-IN"
          className="w-full mt-2"
          type="submit"
        />
      </form>

      <button onClick={handleForgotPassword} className="mt-4 text-eucalyptus-500 hover:underline">I forgot my password</button>
    </div>
  );
};

export default LoginForm;
