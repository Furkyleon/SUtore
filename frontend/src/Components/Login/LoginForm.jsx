import React from 'react';
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <div className='page-container'>

      <h1 className='page-title'>SUtore</h1>

      <div className='wrapper'>
        <form action=''>
          <h1>Login</h1>
          <div className='input-box'>
            <input type='text' placeholder='Username' required />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required />
            <FaLock className='icon' />
          </div>
          <div className='remember-forgot'>
            <label><input type="checkbox" /> Remember Me</label>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
          <button type='submit'>Login</button>
          <div className='register-link'>
            <p>Do not have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
