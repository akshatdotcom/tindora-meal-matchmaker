import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../firebase/auth';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error("Error logging in", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-red">
      <div className="bg-white rounded-md shadow-lg p-8 w-96 h-96 flex flex-col justify-center">
        <img src={logo} alt="Logo" className="w-24 h-auto mx-auto mb-6" />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-6 border border-gray-300 rounded-md placeholder-gray-500"
        />
        <button 
          onClick={handleLogin} 
          className="w-full p-3 mb-4 bg-custom-red-300 text-white rounded-md font-semibold hover:bg-custom-red-200"
        >
          Login
        </button>
        <p className="text-center text-black">
          Want to Start Swiping?{' '}
          <span 
            className="text-green-500 cursor-pointer" 
            onClick={() => navigate('/register')}
          >
            Sign up Now!
          </span>
        </p>
      </div>
    </div>
  ); 
} 

export default Login;