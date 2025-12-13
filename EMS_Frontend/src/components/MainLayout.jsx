// src/components/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminSidebarMenu from './AdminSidebarMenu';
import EmployeeSidebarMenu from './EmployeeSidebarMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout({ user, onLogout }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // This useEffect manages the body classes for the main layout and sidebar collapse
  useEffect(() => {
    document.body.className = "hold-transition sidebar-mini";
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapse');
    } else {
      document.body.classList.remove('sidebar-collapse');
    }
    return () => {
      document.body.className = '';
    };
  }, [isSidebarCollapsed]);

  // This useEffect re-initializes AdminLTE plugins on route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.$ && window.$.fn.Treeview) {
        window.$('[data-widget="treeview"]').Treeview('init');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);


  // Handler for sidebar toggle (Unchanged)
  const handleToggleSidebar = (e) => {
    e.preventDefault();
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // =======================================================================
  // <<<--- THIS IS THE FIX ---<<<
  // The function now accepts the event 'e' and calls e.preventDefault()
  // =======================================================================
  const handleLogoutClick = (e) => {
    e.preventDefault(); // This stops the browser from adding '#' to the URL
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#" role="button" onClick={handleToggleSidebar}>
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <img src="/adminlte/dist/img/user2-160x160.jpg" className="img-circle elevation-1" alt="User Image" style={{width: '25px', marginRight: '8px'}} />
              <span>{user?.name}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">{user?.role}</span>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item">
                <i className="fas fa-user mr-2"></i> My Account
              </Link>
              <div className="dropdown-divider"></div>
              {/* The event 'e' is automatically passed to the handler by the browser */}
              <a href="#" className="dropdown-item" onClick={handleLogoutClick}>
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="#" className="brand-link">
          <img src="/adminlte/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">TechHive EMS</span>
        </a>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src="/adminlte/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">{user?.name} </a>
            </div>
          </div>
          <nav className="mt-2">
            {user?.role === 'ADMIN' ? <AdminSidebarMenu /> : <EmployeeSidebarMenu />}
          </nav>
        </div>
      </aside>

      <div className="content-wrapper">
        <Outlet context={{ user }} />
      </div>
      
      <footer className="main-footer">
        <strong>Copyright © 2025 <a href="#">TechHive</a>.                                    </strong> All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;