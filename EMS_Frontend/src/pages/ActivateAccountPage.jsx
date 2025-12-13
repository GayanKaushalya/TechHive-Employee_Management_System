// src/pages/ActivateAccountPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function ActivateAccountPage() {
  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'register-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleActivation = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError('The new passwords do not match. Please try again.');
      return;
    }
    if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/activate', {
        email,
        temporaryPassword,
        newPassword
      });

      setSuccess(response.data + ' Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data || 'Activation failed. Please check your details.');
      console.error('Activation failed:', err);
    }
  };

  return (
    <div className="register-box">
      <div className="register-logo">
        <a href="#"><b>TechHive</b> EMS</a>
      </div>
      <div className="card">
        <div className="card-body register-card-body">
          <p className="login-box-msg">Activate Your Account</p>
          
          <form onSubmit={handleActivation}>
            {error && <div className="alert alert-danger p-2">{error}</div>}
            {success && <div className="alert alert-success p-2">{success}</div>}

            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-group-append"><div className="input-group-text"><span className="fas fa-envelope" /></div></div>
            </div>
            <div className="input-group mb-3">
              <input 
                type="password" 
                className="form-control" 
                placeholder="Temporary password"
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
              />
              <div className="input-group-append"><div className="input-group-text"><span className="fas fa-key" /></div></div>
            </div>
            <div className="input-group mb-3">
              <input 
                type={isNewPasswordVisible ? "text" : "password"}
                className="form-control" 
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span 
                    className={isNewPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
                    onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input 
                type={isConfirmPasswordVisible ? "text" : "password"}
                className="form-control" 
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span 
                    className={isConfirmPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button type="submit" className="btn btn-primary btn-block">Activate Account</button>
              </div>
            </div>
          </form>

          <Link to="/login" className="text-center">I already have an account</Link>
        </div>
      </div>
    </div>
  );
}

export default ActivateAccountPage;