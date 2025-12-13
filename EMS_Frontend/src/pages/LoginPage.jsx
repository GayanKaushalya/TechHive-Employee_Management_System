// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.className = 'login-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });

      const { token } = response.data;
      
      localStorage.setItem('token', token);
      onLoginSuccess();
      
    } catch (err) {
      setError('Invalid email or password.');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-box">
      <div className="login-logo">
        <a href="#"><b>TechHive</b> EMS</a>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          
          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger p-2">{error}</div>}
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text"><span className="fas fa-envelope" /></div>
              </div>
            </div>
            {/* Updated Password Field */}
            <div className="input-group mb-3">
              <input 
                type={isPasswordVisible ? "text" : "password"} 
                className="form-control" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span 
                    className={isPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
                <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">
                        Remember Me
                    </label>
                </div>
              </div>
              <div className="col-4">
                <button type="submit" className="btn btn-primary btn-block">Sign In</button>
              </div>
            </div>
          </form>

          <p className="mb-1">
            <a href="#">I forgot my password</a>
          </p>
          <p className="mb-0">
            <Link to="/activate" className="text-center">Activate a new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;