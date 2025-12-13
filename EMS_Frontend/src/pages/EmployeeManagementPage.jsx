// src/pages/EmployeeManagementPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/apiClient';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal'; 
import NewEmployeeInfoModal from '../components/NewEmployeeInfoModal';

import { toast } from 'react-toastify';

import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null); // Ref to store the DataTable instance

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [employeeToView, setEmployeeToView] = useState(null);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [newEmployeeInfo, setNewEmployeeInfo] = useState(null);


  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Could not fetch employee data.");
    }
  };

  // This useEffect runs only ONCE to initialize the table with column definitions.
  useEffect(() => {
    const dt = $(tableRef.current).DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: false,
      pageLength: 5,
      lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
      pagingType: "simple_numbers",

      columns: [
        { data: 'employeeId' },
        { 
          data: null, // We build this column's content from other data properties
          render: (data, type, row) => `${row.firstName} ${row.lastName}`
        },
        { data: 'email' },
        { data: 'jobTitle' },
        { data: 'departmentId', defaultContent: 'Not Assigned' }, // Shows 'N/A' if the value is null
        {
          data: 'accountStatus',
          render: (data) => `<span class="badge ${data === 'ACTIVE' ? 'bg-success' : 'bg-warning'}">${data.replace('_', ' ')}</span>`
        },
        {
          data: null, // This is the Actions column
          orderable: false, // The Actions column should not be sortable
          // This render function creates the HTML for the dropdown button
          render: () => `
            <div class="dropdown">
              <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown">Action</button>
              <div class="dropdown-menu">
                <button class="dropdown-item view-btn"><i class="fas fa-eye mr-2"></i> View</button>
                <button class="dropdown-item edit-btn"><i class="fas fa-edit mr-2"></i> Edit</button>
                <button class="dropdown-item delete-btn"><i class="fas fa-trash mr-2"></i> Delete</button>
              </div>
            </div>`
        }
      ]
    });

    dataTableRef.current = dt;
    const tableBody = $(tableRef.current).find('tbody');

    // --- Add a single, delegated event listener for all delete buttons ---
    $(tableRef.current).on('click', '.delete-btn', function() {
      // Get the full data object for the row that was clicked
      const rowData = dt.row($(this).closest('tr')).data();
      handleDeleteClick(rowData);
    });

     tableBody.on('click', '.view-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleViewClick(rowData);
    });

    tableBody.on('click', '.delete-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleDeleteClick(rowData);
    });

    // <<<--- ADD EVENT LISTENER FOR THE EDIT BUTTON ---<<<
    tableBody.on('click', '.edit-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleEditClick(rowData);
    });

    // Fetch the initial data after the table is set up
    fetchEmployees();

    // Cleanup function to destroy the DataTable and event listeners
    return () => {
      tableBody.off('click', '.delete-btn');
      tableBody.off('click', '.edit-btn');
      tableBody.off('click', '.view-btn'); // <-- Clean up the new listener
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
      }
    };
  }, []);


  // This useEffect updates the data in the table whenever the 'employees' state changes.
  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.clear();
      dataTableRef.current.rows.add(employees);
      dataTableRef.current.draw();
    }
  }, [employees]);


  // Delete Handlers
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(`/employees/${employeeToDelete.employeeId}`);
      toast.success(`'${employeeToDelete.firstName} ${employeeToDelete.lastName}' deleted successfully.`);
      handleCloseModal();
      // This will trigger the second useEffect to update the table via its API
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee.");
      console.error("Failed to delete employee:", error);
      handleCloseModal();
    }
  };
   const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  
  const handleEditClick = (employee) => {
    setEmployeeToEdit(employee);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEmployeeToEdit(null);
  };

  const handleViewClick = (employee) => {
    setEmployeeToView(employee);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setEmployeeToView(null);
  };
  const handleCredentialsReceived = (credentials) => {
    toast.success(`Employee '${credentials.employeeId}' created successfully!`);
    setNewEmployeeInfo(credentials);
    setShowInfoModal(true);
  };
  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setNewEmployeeInfo(null);
  };

  

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">List of All Employees</h3>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" onClick={fetchEmployees} title="Refresh Data">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <button type="button" className="btn btn-primary ml-2" onClick={handleShowAddModal}>
                  <i className="fas fa-plus"></i> Add New
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* The table now renders an empty tbody, as DataTable will manage its content */}
              <table ref={tableRef} className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* DataTable will populate this section via the API */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      
      <DeleteConfirmationModal 
        show={showDeleteModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${employeeToDelete?.firstName || ''} ${employeeToDelete?.lastName || ''} permanently?`}
      />

      <AddEmployeeModal 
        show={showAddModal}
        onHide={handleCloseAddModal}
        onAddSuccess={fetchEmployees}
        onCredentialsReceived={handleCredentialsReceived} // <<<--- PASS THE NEW PROP
      />

      <EditEmployeeModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onEditSuccess={fetchEmployees} // On success, refresh the table
        employeeData={employeeToEdit} // Pass the selected employee's data
      />

      <ViewEmployeeModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        employeeData={employeeToView} // Pass the selected employee's data
      />

      <NewEmployeeInfoModal
        show={showInfoModal}
        onHide={handleCloseInfoModal}
        newEmployeeInfo={newEmployeeInfo}
      />
    </>
  );
}

export default EmployeeManagementPage;