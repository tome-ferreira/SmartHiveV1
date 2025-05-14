import React from 'react';

type SmartHivePrimaryBtnProps = {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset'; 
  disabled?: boolean;
};

const SmartHivePrimaryBtn: React.FC<SmartHivePrimaryBtnProps> = ({
  text,
  icon,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        bg-[#36916a] text-white px-4 py-2 rounded-full
        hover:bg-[#355c4c]  transition duration-200 ease-in-out
        hover:scale-[1.03] shadow-md hover:shadow-lg
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default SmartHivePrimaryBtn;
