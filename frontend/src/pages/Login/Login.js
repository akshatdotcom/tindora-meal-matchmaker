import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../firebase/auth';
import './Login.css';
import logo from '../../assets/logo.png';

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
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login</button>
        <p className="signup-link" onClick={() => navigate('/register')}>
          Want to Start Swiping? <span>Sign Up!</span>
        </p>
      </div>
    </div>
  );
};

export default Login;