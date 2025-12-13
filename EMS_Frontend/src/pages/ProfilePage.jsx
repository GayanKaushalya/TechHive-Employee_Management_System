// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function ProfilePage() {
  const { user } = useOutletContext();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for the password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // --- NEW STATE FOR PASSWORD VISIBILITY ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user details logic 
  useEffect(() => {
    if (user?.id) {
      const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/employees/${user.id}/dashboard`);
          setEmployeeDetails(response.data);
        } catch (error) {
          toast.error("Could not load your profile details.");
          console.error("Failed to fetch user details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [user]);

  // Password change submission logic 
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
        toast.warn("New password must be at least 8 characters long.");
        return;
    }
    if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        return;
    }
    setIsUpdating(true);
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data || "Failed to change password. Check your current password.");
      console.error("Password change failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper component for displaying details 
  const DetailRow = ({ label, value }) => (
    <dl className="row">
      <dt className="col-sm-4">{label}</dt>
      <dd className="col-sm-8">{value || 'N/A'}</dd>
    </dl>
  );

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0">My Account / Profile</h1>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* --- User Details Card  --- */}
            <div className="col-md-6">
              <div className="card card-primary card-outline">
                <div className="card-header"><h3 className="card-title">My Information</h3></div>
                <div className="card-body">
                  {isLoading ? <p>Loading...</p> : (
                    <>
                      <DetailRow label="Employee ID" value={employeeDetails?.employeeId} />
                      <DetailRow label="Full Name" value={`${employeeDetails?.firstName} ${employeeDetails?.lastName}`} />
                      <DetailRow label="Email" value={employeeDetails?.email} />
                      <DetailRow label="Job Title" value={employeeDetails?.jobTitle} />
                      <DetailRow label="Department" value={employeeDetails?.departmentName} />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* --- Change Password Card --- */}
            <div className="col-md-6">
              <div className="card card-warning card-outline">
                <div className="card-header"><h3 className="card-title">Change Password</h3></div>
                <div className="card-body">
                  <form onSubmit={handlePasswordChange}>
                    {/* =============================================================== */}
                    {/* <<<--- THIS IS THE UPDATED FORM SECTION ---<<<                 */}
                    {/* =============================================================== */}
                    <div className="form-group">
                      <label>Current Password</label>
                      <div className="input-group">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          value={currentPassword} 
                          onChange={e => setCurrentPassword(e.target.value)} 
                          className="form-control" 
                          required 
                        />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <i className={showCurrentPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <div className="input-group">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)} 
                          className="form-control" 
                          required 
                        />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                            <i className={showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <div className="input-group">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)} 
                          className="form-control" 
                          required 
                        />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;