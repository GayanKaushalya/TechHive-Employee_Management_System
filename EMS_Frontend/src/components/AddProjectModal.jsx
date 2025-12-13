// src/components/AddProjectModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function AddProjectModal({ show, onHide, onAddSuccess }) {
  // State for the form fields
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');

  // Function to clear the form fields
  const clearForm = () => {
    setProjectName('');
    setDescription('');
    setStartDate('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newProjectData = {
      projectName,
      description,
      startDate,
      // The backend will automatically set the status to 'PENDING'
    };

    try {
      await apiClient.post('/projects', newProjectData);
      toast.success(`Project '${projectName}' created successfully!`);
      
      clearForm(); // Clear the form for the next entry
      onAddSuccess(); // This calls fetchProjects in the parent component to refresh the table
      onHide(); // This closes the modal
    } catch (error){
      console.error("Failed to create project", error);
      toast.error(error.response?.data?.message || "Failed to create project.");
    }
  };

  // Use a different handler for onHide to also clear the form
  const handleHide = () => {
    clearForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control 
              type="text" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              required 
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleHide} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Project
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddProjectModal;