import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UpdatePasswordForm from "../../../components/auth/UpdatePasswordForm";
import { useEffect } from "react";
import { supabase } from "../../../services/supabase-client";

const UpdatePasswordPage = () => {
  const {  user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (error) console.error("Failed to set session:", error.message);
          });
      }
    }
  }, []);

  

  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-eucalyptus-950 p-8 rounded-lg shadow-lg w-full text-center">
          <img src="\img\logos\SmartHiveLogoHor.png" alt="SmartHive Logo" />
        </div>
        <div className="bg-[#f0f9f4] p-8 rounded-lg shadow-lg w-full text-center">
            <UpdatePasswordForm/>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
