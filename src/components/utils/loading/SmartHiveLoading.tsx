import {TrophySpin} from "react-loading-indicators"

const SmartHiveLoading = () => {
  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <div className="p-8 rounded-lg w-full text-center">
          <img src="\img\logos\SmartHiveLogoHor.png" alt="SmartHive Logo"  />
          <TrophySpin color="#36916a" size="large" text="" textColor="" />
        </div>
      </div>
  );
};

export default SmartHiveLoading;
