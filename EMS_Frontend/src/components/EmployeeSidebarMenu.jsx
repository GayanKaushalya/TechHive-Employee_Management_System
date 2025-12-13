// src/components/EmployeeSidebarMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function EmployeeSidebarMenu() {
  return (
    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
      <li className="nav-item">
        <NavLink to="/employee/dashboard" className="nav-link">
          <i className="nav-icon fas fa-tachometer-alt" />
          <p>My Dashboard</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/employee/feedback" className="nav-link">
          <i className="nav-icon fas fa-comments" />
          <p>Feedback</p>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/employee/profile" className="nav-link">
          <i className="nav-icon fas fa-user" />
          <p>My Profile</p>
        </NavLink>
      </li>
    </ul>
  );
}

export default EmployeeSidebarMenu;