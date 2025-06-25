import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { Typography } from "@mui/material";
import { useDeactivateDownpaimentHook } from "../../hooks/SystemsHooks";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const systemId = searchParams.get("systemId") || "";

  const { mutateAsync: deactivateDownpayment } = useDeactivateDownpaimentHook();

  useEffect(() => {
    if (systemId) {
      deactivateDownpayment(systemId);
    }
  }, [systemId, deactivateDownpayment]);

  const handleGoBack = () => {
    navigate(`/Client/Systems/Details/${systemId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-eucalyptus-950 p-8 rounded-lg shadow-lg w-full text-center">
          <img src="/img/logos/SmartHiveLogoHor.png" alt="SmartHive Logo" />
        </div>
        <div className="bg-[#f0f9f4] p-8 rounded-lg shadow-lg w-full text-center">
          <Typography variant="h5">Payment was cancelled by user</Typography>

          <SmartHivePrimaryBtn
            text="Back to system details"
            className="px-4 py-2 mx-auto"
            onClick={handleGoBack}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
