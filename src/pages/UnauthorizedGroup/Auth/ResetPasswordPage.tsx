import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const {  user } = useAuth();
  const navigate = useNavigate();

  if(user){
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center xiscard-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-[#011134] p-8 rounded-lg shadow-lg w-full text-center">
          <img src="\img\logos\xiscard-big-logo-no-shadow.png" alt="Xiscard Logo" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
            <ResetPasswordForm/>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
