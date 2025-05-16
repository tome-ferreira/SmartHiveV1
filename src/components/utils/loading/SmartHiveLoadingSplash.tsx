import {TrophySpin} from "react-loading-indicators"

const SmartHiveLoadingSplash = () => {
  return (
    <div className="min-h-screen flex items-center justify-center smarthive-grad-bg p-10">
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="bg-eucalyptus-950 p-8 rounded-lg shadow-lg w-full text-center">
          <img src="\img\logos\SmartHiveLogoHor.png" alt="SmartHive Logo"  />
          <TrophySpin color="#36916a" size="large" text="" textColor="" />
        </div>
      </div>
    </div>
  );
};

export default SmartHiveLoadingSplash;
