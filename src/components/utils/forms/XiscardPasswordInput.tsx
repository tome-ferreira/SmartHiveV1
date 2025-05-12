import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  className?: string;
};

const XiscardPasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Password',
  name = 'password',
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default XiscardPasswordInput;
