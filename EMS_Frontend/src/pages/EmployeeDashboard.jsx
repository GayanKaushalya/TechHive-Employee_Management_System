// src/pages/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

// A reusable component for our info cards
const InfoCard = ({ title, value, icon, color }) => (
  <div className="col-md-4 col-sm-6 col-12">
    <div className="info-box">
      <span className={`info-box-icon ${color}`}><i className={`fas ${icon}`}></i></span>
      <div className="info-box-content">
        <span className="info-box-text">{title}</span>
        <span className="info-box-number">{value || 'N/A'}</span>
      </div>
    </div>
  </div>
);


function EmployeeDashboard() {
  const { user } = useOutletContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/employees/${user.id}/dashboard`);
          setDashboardData(response.data);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          toast.error("Could not load your dashboard information.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  // Loading spinner
  if (isLoading) {
    return (
      <div className="content-wrapper d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Error message
  if (!dashboardData) {
    return (
      <div className="content-wrapper p-3">
        <h3>Dashboard Unavailable</h3>
        <p>Could not load your dashboard data at this time. Please try again later.</p>
      </div>
    );
  }

  // Helper function to render the status badge for projects
  const renderStatusBadge = (status) => {
    let badgeClass = 'bg-secondary';
    if (status === 'IN-PROGRESS') badgeClass = 'bg-primary';
    else if (status === 'COMPLETED') badgeClass = 'bg-success';
    else if (status === 'PENDING') badgeClass = 'bg-warning';
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };


  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">My Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* --- Info Cards Row --- */}
          <div className="row">
            <InfoCard 
              title="Job Title"
              value={dashboardData.jobTitle}
              icon="fa-briefcase"
              color="bg-info"
            />
            <InfoCard 
              title="Department"
              value={dashboardData.departmentName}
              icon="fa-building"
              color="bg-success"
            />
            <InfoCard 
              title="Salary"
              value={dashboardData.salary ? `LKR ${dashboardData.salary.amount.toLocaleString()}` : 'Not Set'}
              icon="fa-dollar-sign"
              color="bg-warning"
            />
          </div>
          
          {/* --- Assigned Projects Section --- */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">My Assigned Projects</h3>
                </div>
                <div className="card-body table-responsive p-0">
                  <table className="table table-hover text-nowrap">
                    <thead>
                      <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.projects.length > 0 ? (
                        dashboardData.projects.map(project => (
                          <tr key={project.projectId}>
                            <td>{project.projectId}</td>
                            <td>{project.projectName}</td>
                            <td>{renderStatusBadge(project.projectStatus)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">You are not currently assigned to any projects.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default EmployeeDashboard;