import React from 'react';

type SmartHiveDangerBtnProps = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const SmartHiveDangerBtn: React.FC<SmartHiveDangerBtnProps> = ({
  label,
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
        bg-[#e63946] text-white px-4 py-2 rounded-full
        hover:bg-[#c5303c] transition duration-200 ease-in-out
        hover:scale-[1.03] shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default SmartHiveDangerBtn;
