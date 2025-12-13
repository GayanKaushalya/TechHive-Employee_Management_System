// src/pages/DepartmentManagementPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ViewDepartmentModal from '../components/ViewDepartmentModal'; // Import the new View modal

// For simplicity, we define the simple modal components in the same file.
const AddDepartmentModal = ({ show, onHide, onAddSuccess }) => {
    const [departmentName, setDepartmentName] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!departmentName.trim()) {
            toast.warn("Department name cannot be empty.");
            return;
        }
        try {
            await apiClient.post('/departments', { departmentName });
            toast.success("Department created successfully!");
            setDepartmentName('');
            onAddSuccess();
            onHide();
        } catch (error) { 
            console.error("Failed to create department:", error);
            toast.error("Failed to create department."); 
        }
    };

    return (
        <Modal show={show} onHide={() => { setDepartmentName(''); onHide(); }} centered>
            <Modal.Header closeButton><Modal.Title>Add New Department</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control type="text" value={departmentName} onChange={e => setDepartmentName(e.target.value)} required autoFocus />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={() => { setDepartmentName(''); onHide(); }} className="mr-2">Cancel</Button>
                        <Button type="submit" variant="primary">Save Department</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const EditDepartmentModal = ({ show, onHide, onEditSuccess, departmentData }) => {
    const [departmentName, setDepartmentName] = useState('');
    useEffect(() => {
        if (departmentData) {
            setDepartmentName(departmentData.departmentName);
        }
    }, [departmentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!departmentName.trim()) {
            toast.warn("Department name cannot be empty.");
            return;
        }
        try {
            await apiClient.put(`/departments/${departmentData.departmentId}`, { departmentName });
            toast.success("Department updated successfully!");
            onEditSuccess();
            onHide();
        } catch (error) { 
            console.error("Failed to update department:", error);
            toast.error("Failed to update department."); 
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title>Edit Department</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control type="text" value={departmentName} onChange={e => setDepartmentName(e.target.value)} required autoFocus />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="mr-2">Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};


function DepartmentManagementPage() {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for all modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    
    // <<<--- NEW STATE FOR THE VIEW MODAL ---<<<
    const [showViewModal, setShowViewModal] = useState(false);
    const [departmentToView, setDepartmentToView] = useState(null);


    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            toast.error("Could not fetch department data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchDepartments(); }, []);

    // --- Handlers for opening and closing modals ---
    const handleEditClick = (dept) => { setDepartmentToEdit(dept); setShowEditModal(true); };
    const handleDeleteClick = (dept) => { setDepartmentToDelete(dept); setShowDeleteModal(true); };
    
    // <<<--- NEW HANDLER FOR THE VIEW MODAL ---<<<
    const handleViewClick = (dept) => { setDepartmentToView(dept); setShowViewModal(true); };
    
    const handleConfirmDelete = async () => {
        if (!departmentToDelete) return;
        try {
            await apiClient.delete(`/departments/${departmentToDelete.departmentId}`);
            toast.success(`Department "${departmentToDelete.departmentName}" deleted successfully.`);
            fetchDepartments(); // Refresh list on success
        } catch (error) {
            console.error("Failed to delete department:", error);
            toast.error("Failed to delete. Make sure the department has no employees assigned.");
        }
        setShowDeleteModal(false);
        setDepartmentToDelete(null);
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
                           <h3 className="card-title">List of All Departments</h3>
                            <div className="card-tools">
                                <button type="button" className="btn btn-tool" onClick={fetchDepartments} disabled={isLoading} title="Refresh Data">
                                    <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
                                </button>
                                <button type="button" className="btn btn-primary ml-2" onClick={() => setShowAddModal(true)}>
                                    <i className="fas fa-plus"></i> Add Department
                                </button>
                            </div>

                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>Department ID</th>
                                            <th>Department Name</th>
                                            <th style={{ width: '20%' }}>No. of Employees</th>
                                            <th style={{ width: '15%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map(dept => (
                                            <tr key={dept.departmentId}>
                                                <td>{dept.departmentId}</td>
                                                <td>{dept.departmentName}</td>
                                                <td>{dept.employeeCount}</td>
                                                <td>
                                                    {/* =============================================================== */}
                                                    {/* <<<--- THIS IS THE UPDATED ACTIONS COLUMN ---<<<                */}
                                                    {/* =============================================================== */}
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <button className="dropdown-item" onClick={() => handleViewClick(dept)}>
                                                                <i className="fas fa-eye mr-2"></i> View
                                                            </button>
                                                            <button className="dropdown-item" onClick={() => handleEditClick(dept)}>
                                                                <i className="fas fa-edit mr-2"></i> Edit
                                                            </button>
                                                            <button className="dropdown-item" onClick={() => handleDeleteClick(dept)}>
                                                                <i className="fas fa-trash mr-2"></i> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- All Modals Rendered Here --- */}
            <AddDepartmentModal show={showAddModal} onHide={() => setShowAddModal(false)} onAddSuccess={fetchDepartments} />
            <EditDepartmentModal show={showEditModal} onHide={() => setShowEditModal(false)} onEditSuccess={fetchDepartments} departmentData={departmentToEdit} />
            <DeleteConfirmationModal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)} 
                onConfirm={handleConfirmDelete} 
                message={`Are you sure you want to delete the department "${departmentToDelete?.departmentName}"? This cannot be undone.`} 
            />
            {/* <<<--- RENDER THE NEW VIEW MODAL ---<<< */}
            <ViewDepartmentModal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                departmentData={departmentToView}
            />
        </>
    );
}

export default DepartmentManagementPage;