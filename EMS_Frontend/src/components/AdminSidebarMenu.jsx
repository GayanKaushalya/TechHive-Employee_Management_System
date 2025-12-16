// src/components/AdminSidebarMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; 
function AdminSidebarMenu() {
  return (
    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
      <li className="nav-item">
        {/* NavLink will automatically add an "active" class to the link when the URL matches */}
        <NavLink to="/admin/dashboard" className="nav-link">
          <i className="nav-icon fas fa-tachometer-alt" />
          <p>Dashboard</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/employees" className="nav-link">
          <i className="nav-icon fas fa-users" />
          <p>Employee Management</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/departments" className="nav-link">
          <i className="nav-icon fas fa-building" />
          <p>Department Management</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/projects" className="nav-link">
          <i className="nav-icon fas fa-project-diagram" />
          <p>Project Management</p>
        </NavLink>
      </li>
      
      <li className="nav-item">
        <NavLink to="/admin/salaries" className="nav-link">
          <i className="nav-icon fas fa-dollar-sign" />
          <p>Salary Management</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/reports" className="nav-link">
          <i className="nav-icon fas fa-file-pdf" />
          <p>Reports</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/feedback" className="nav-link">
          <i className="nav-icon fas fa-comment-dots" />
          <p>Feedback Management</p>
        </NavLink>
      </li>
    </ul>
  );
}

export default AdminSidebarMenu;