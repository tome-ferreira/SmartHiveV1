import { useState } from "react";
import { FaAt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SmartHivePasswordInput from "../utils/forms/SmartHivePasswordInput";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";

const UpdatePasswordForm = () => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    const error = await updatePassword(password);
    if(error){
        setError(error);
    }else{
        setSucess("Password updated successfully!");
        navigate("/sign-in")
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

      {/* Password */}
      <div className="relative">
        <SmartHivePasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          placeholder='Password'
        />                 
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <SmartHivePasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
          placeholder="Confirm password"
        /> 
      </div>

      <SmartHivePrimaryBtn
        text="Reset Password"
        className="w-full mt-2"
        onClick={handleSubmit}
      />
    </form>
  );
};

export default UpdatePasswordForm;
