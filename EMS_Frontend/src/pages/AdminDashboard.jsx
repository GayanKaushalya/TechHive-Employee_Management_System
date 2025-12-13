// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

// A reusable component for our summary cards
const StatCard = ({ count, title, icon, color, linkTo }) => (
  <div className="col-lg-3 col-6">
    <div className={`small-box ${color}`}>
      <div className="inner">
        <h3>{count}</h3>
        <p>{title}</p>
      </div>
      <div className="icon">
        <i className={`fas ${icon}`} />
      </div>
      <Link to={linkTo} className="small-box-footer">
        More info <i className="fas fa-arrow-circle-right" />
      </Link>
    </div>
  </div>
);


function AdminDashboard() {
  // State to hold our dashboard metrics
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    pendingProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    totalDepartments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [employeesResponse, projectsResponse, departmentsResponse] = await Promise.all([
          apiClient.get('/employees'),
          apiClient.get('/projects'),
          apiClient.get('/departments')
        ]);

        const projects = projectsResponse.data;
        
        // Calculate project stats
        const pending = projects.filter(p => p.status === 'PENDING').length;
        const inProgress = projects.filter(p => p.status === 'IN-PROGRESS').length;
        const completed = projects.filter(p => p.status === 'COMPLETED').length;

        // Update the state with all the fetched and calculated data
        setStats({
          totalEmployees: employeesResponse.data.length,
          totalProjects: projects.length,
          pendingProjects: pending,
          inProgressProjects: inProgress,
          completedProjects: completed,
          totalDepartments: departmentsResponse.data.length
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Run only once on component mount

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0">Admin Dashboard</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* --- First Row of Stat Cards --- */}
              <div className="row">
                <StatCard 
                  count={stats.totalEmployees} 
                  title="Total Employees" 
                  icon="fa-users" 
                  color="bg-info" 
                  linkTo="/admin/employees"
                />
                <StatCard 
                  count={stats.totalProjects} 
                  title="Total Projects" 
                  icon="fa-project-diagram" 
                  color="bg-success" 
                  linkTo="/admin/projects"
                />
                <StatCard 
                  count={stats.totalDepartments} 
                  title="Total Departments" 
                  icon="fa-building" 
                  color="bg-purple" 
                  linkTo="/admin/departments"
                />
              </div>

              {/* --- Second Row of Project-Specific Stat Cards --- */}
              <h5 className="mt-4 mb-2">Project Status Overview</h5>
              <div className="row">
                <StatCard 
                  count={stats.pendingProjects} 
                  title="Pending Projects" 
                  icon="fa-clock" 
                  color="bg-warning" 
                  linkTo="/admin/projects"
                />
                <StatCard 
                  count={stats.inProgressProjects} 
                  title="In-Progress Projects" 
                  icon="fa-tasks" 
                  color="bg-primary" 
                  linkTo="/admin/projects"
                />
                <StatCard 
                  count={stats.completedProjects} 
                  title="Completed Projects" 
                  icon="fa-check-circle" 
                  color="bg-teal" 
                  linkTo="/admin/projects"
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;