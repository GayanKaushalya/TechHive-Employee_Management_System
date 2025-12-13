// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// --- Page Imports ---
import LoginPage from './pages/LoginPage';
import ActivateAccountPage from './pages/ActivateAccountPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import FeedbackManagementPage from './pages/FeedbackManagementPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import SalaryManagementPage from './pages/SalaryManagementPage';
import EmployeeFeedbackPage from './pages/EmployeeFeedbackPage';

// --- Layout Import ---
import MainLayout from './components/MainLayout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This logic is correct and does not need to change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ role: decodedToken.role, id: decodedToken.sub, email: decodedToken.email, name: decodedToken.name });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({ role: decodedToken.role, id: decodedToken.sub, email: decodedToken.email, name: decodedToken.name });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div></div>; // Or a loading spinner
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================================= */}
        {/* <<<--- THIS IS THE NEW, CORRECTED ROUTING LOGIC ---<<<              */}
        {/* ======================================================================= */}
        
        {/* If the user is NOT logged in, only these routes are available */}
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/activate" element={<ActivateAccountPage />} />
            {/* Any other path will redirect to the login page */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          /* If the user IS logged in, these protected routes are available */
          <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
            {/* --- Admin Only Routes --- */}
            {user.role === 'ADMIN' && (
              <>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/employees" element={<EmployeeManagementPage />} />
                <Route path="admin/projects" element={<ProjectManagementPage />} />
                <Route path="admin/departments" element={<DepartmentManagementPage />} />
                <Route path="admin/feedback" element={<FeedbackManagementPage user={user} />} />
                <Route path="admin/reports" element={<ReportsPage />} />
                <Route path="admin/salaries" element={<SalaryManagementPage />} />
              </>
            )}

            {/* --- Employee Only Routes --- */}
            {user.role === 'EMPLOYEE' && (
              <>
                <Route path="employee/dashboard" element={<EmployeeDashboard />} />
                 <Route path="employee/feedback" element={<EmployeeFeedbackPage />} />
              </>
            )}
            
            {/* --- Routes for ALL Logged-in Users --- */}
            <Route path="profile" element={<ProfilePage />} />

            {/* --- Index Redirect for logged-in users --- */}
            <Route 
              index 
              element={
                user.role === 'ADMIN' ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/employee/dashboard" replace />
              }
            />
             {/* --- Catch-all for logged-in users --- */}
             {/* If a logged-in user tries a bad URL, redirect them to their dashboard */}
            <Route 
              path="*" 
              element={
                user.role === 'ADMIN' ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/employee/dashboard" replace />
              }
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;