// src/components/EditProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function EditProjectModal({ show, onHide, onEditSuccess, projectData }) {
  // State to manage the form fields
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  // This useEffect hook populates the form whenever a new project is selected for editing
  useEffect(() => {
    if (projectData) {
      setFormData({
        projectName: projectData.projectName || '',
        description: projectData.description || '',
        // Dates need to be in YYYY-MM-DD format for the input field
        startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().split('T')[0] : '',
        endDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : '',
        status: projectData.status || 'PENDING'
      });
    }
  }, [projectData]); // Re-run this effect only when the projectData prop changes

  // A single handler to update the form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!projectData) return;

    // We don't need to send all fields for an update. Let's send what can be changed.
    const updatedData = {
      projectName: formData.projectName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || null, // Send null if the date is cleared
      status: formData.status
    };

    try {
      // Use a PUT request to the specific project's endpoint
      await apiClient.put(`/projects/${projectData.projectId}`, updatedData);
      toast.success("Project details updated successfully!");
      
      onEditSuccess(); // This calls fetchProjects in the parent component to refresh the table
      onHide(); // This closes the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
      console.error("Failed to update project", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control type="text" name="projectName" value={formData.projectName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="PENDING">PENDING</option>
              <option value="IN-PROGRESS">IN-PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </Form.Group>
          
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProjectModal;