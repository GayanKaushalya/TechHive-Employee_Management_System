// src/pages/ProjectManagementPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import the modal
import AddProjectModal from '../components/AddProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import AssignEmployeeModal from '../components/AssignEmployeeModal';
import ViewProjectModal from '../components/ViewProjectModal';


import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // --- NEW: State for the delete confirmation modal ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

   const [showEditModal, setShowEditModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [projectToAssign, setProjectToAssign] = useState(null);

   const [showViewModal, setShowViewModal] = useState(false);
  const [projectToView, setProjectToView] = useState(null);


 const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Could not fetch project data.");
    }
  };


  // This useEffect runs only ONCE to initialize the table.
  useEffect(() => {
    const dt = $(tableRef.current).DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: false,
      pageLength: 5,
      lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
      pagingType: "simple_numbers",
      columns: [
        { data: 'projectId' },
        { data: 'projectName' },
        { 
          data: 'status',
          // This render function creates the colored badge HTML
          render: (data) => {
            let badgeClass = 'bg-secondary'; // Default color
            if (data === 'IN-PROGRESS') {
              badgeClass = 'bg-primary';
            } else if (data === 'COMPLETED') {
              badgeClass = 'bg-success';
            } else if (data === 'PENDING') {
              badgeClass = 'bg-warning';
            }
            return `<span class="badge ${badgeClass}">${data}</span>`;
          }
        },
        { data: 'startDate' },
        { data: 'endDate', defaultContent: 'N/A' },
        {
          data: null,
          orderable: false,
          render: () => `
            <div class="dropdown">
              <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown">Action</button>
              <div class="dropdown-menu">
                <button class="dropdown-item assign-btn"><i class="fas fa-users mr-2"></i> Assign Team</button> 
                <button class="dropdown-item view-btn"><i class="fas fa-eye mr-2"></i> View</button>
                <button class="dropdown-item edit-btn"><i class="fas fa-edit mr-2"></i> Edit</button>
                <button class="dropdown-item delete-btn"><i class="fas fa-trash mr-2"></i> Delete</button>
              </div>
            </div>`
        }
      ]
    });


    dataTableRef.current = dt;
    
    // --- SETUP EVENT LISTENER ---
    const tableBody = $(tableRef.current).find('tbody');

    tableBody.on('click', '.view-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleViewClick(rowData);
    });

    tableBody.on('click', '.delete-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleDeleteClick(rowData);
    });

     tableBody.on('click', '.edit-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleEditClick(rowData);
    });

     tableBody.on('click', '.assign-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleAssignClick(rowData);
    });


    fetchProjects();

    // Cleanup function
    return () => {
      tableBody.off('click', '.view-btn');
      tableBody.off('click', '.delete-btn');
      tableBody.off('click', '.edit-btn');
      tableBody.off('click', '.assign-btn');
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
      }
    };
  }, []);


  // This useEffect updates the table when the data changes (Unchanged)
  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.clear();
      dataTableRef.current.rows.add(projects);
      dataTableRef.current.draw();
    }
  }, [projects]);


  // --- NEW: Handler functions for the delete process ---
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await apiClient.delete(`/projects/${projectToDelete.projectId}`);
      toast.success(`Project '${projectToDelete.projectName}' has been deleted successfully.`);
      handleCloseDeleteModal();
      fetchProjects(); // Refresh the table
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
      console.error("Failed to delete project:", error);
      handleCloseDeleteModal();
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditClick = (project) => {
    setProjectToEdit(project);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setProjectToEdit(null);
  };

   const handleAssignClick = (project) => {
    setProjectToAssign(project);
    setShowAssignModal(true);
  };
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setProjectToAssign(null);
  };

  const handleViewClick = (project) => {
    setProjectToView(project);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setProjectToView(null);
  };

  const handleAssignmentChange = () => {
      fetchProjects(); 
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
              <h2 className="card-title">List of All Projects</h2>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" onClick={fetchProjects} title="Refresh Data">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <button type="button" className="btn btn-primary ml-2" onClick={handleShowAddModal}>
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>
            <div className="card-body">
              <table ref={tableRef} className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* DataTable will populate this section */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* --- RENDER THE MODAL --- */}
      <DeleteConfirmationModal 
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the project "${projectToDelete?.projectName}" permanently?`}
      />

      <AddProjectModal
        show={showAddModal}
        onHide={handleCloseAddModal}
        onAddSuccess={fetchProjects} // On success, we call fetchProjects to refresh the table
      />

      <EditProjectModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onEditSuccess={fetchProjects}
        projectData={projectToEdit} // Pass the selected project's data
      />

      <AssignEmployeeModal
        show={showAssignModal}
        onHide={handleCloseAssignModal}
        projectData={projectToAssign} // Pass the selected project's data
        onAssignmentChange={handleAssignmentChange}
      />
      
      <ViewProjectModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        projectData={projectToView}
      />


    </>
  );
}

export default ProjectManagementPage;