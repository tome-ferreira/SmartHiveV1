import React from 'react';

type XiscardOutlineBtnProps = {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const XiscardOutlineBtn: React.FC<XiscardOutlineBtnProps> = ({
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
        bg-white text-[#16274a] border border-[#16274a]
        px-4 py-2 rounded-full
        transition duration-200 ease-in-out
        hover:text-white hover:bg-[#266fd1] hover:border-[#266fd1]
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

export default XiscardOutlineBtn;
