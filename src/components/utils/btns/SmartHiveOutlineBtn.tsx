import React from 'react';

type SmartHiveOutlineBtnProps = {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const SmartHiveOutlineBtn: React.FC<SmartHiveOutlineBtnProps> = ({
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
        bg-white text-[#36916a] border border-[#36916a]
        px-4 py-2 rounded-full
        transition duration-200 ease-in-out
        hover:text-white hover:bg-[#355c4c] hover:border-[#355c4c]
        hover:scale-[1.03] shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default SmartHiveOutlineBtn;
