import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import XiscardPrimaryBtn from '../utils/btns/XiscardPrimaryBtn';
import XiscardPasswordInput from '../utils/forms/XiscardPasswordInput';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

const RegisterForm = ({ returnUrl }: { returnUrl: string }) => {
  const { signUpWithCredentials } = useAuth();
  const { signInWithCredentials } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const displayName = `${name} ${surname}`.trim();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const err = await signUpWithCredentials(email, password, displayName);
    if (err) {
      setError(err);
    } else {
      navigate(`/verify-email?returnUrl=${returnUrl}`, { replace: true });
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-sm mx-auto bg-white rounded p-4 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center text-[#16274a]">
        Create an account
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Name */}
      <div className="relative">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Surname */}
      <div className="relative">
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Password */}
      <div className="relative">
        <XiscardPasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          placeholder='Password'
        />                 
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <XiscardPasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
          placeholder="Confirm password"
        /> 
      </div>

      <XiscardPrimaryBtn text="Register" type="submit" className="w-full" />
    </form>
  );
};

export default RegisterForm;
