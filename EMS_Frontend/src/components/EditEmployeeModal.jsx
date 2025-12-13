// src/components/EditEmployeeModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function EditEmployeeModal({ show, onHide, onEditSuccess, employeeData }) {
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Populate form when employeeData is available
    if (employeeData) {
      setFormData({
        firstName: employeeData.firstName || '',
        lastName: employeeData.lastName || '',
        email: employeeData.email || '',
        jobTitle: employeeData.jobTitle || '',
        departmentId: employeeData.departmentId?.toString() || ''
      });
    }

    // Fetch departments when the modal is shown
    if (show) {
      const fetchDepartments = async () => {
        try {
          const response = await apiClient.get('/departments');
          setDepartments(response.data);
        } catch (error) { // <<<--- FIX 1: Rename to 'err' and use it
          console.error("Failed to fetch departments", error); // Log the actual error
          toast.error("Could not load departments.");
        }
      };
      fetchDepartments();
    } else {
      // FIX 2: Clear departments when the modal is hidden
      setDepartments([]);
    }
  }, [employeeData, show]);
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
    if (!employeeData) return;

    const updatedData = {
      ...formData,
      departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : null
    };

    try {
      await apiClient.put(`/employees/${employeeData.employeeId}`, updatedData);
      toast.success("Employee details updated successfully!");
      
      onEditSuccess(); // This calls fetchEmployees in the parent component
      onHide(); // This closes the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee.");
      console.error("Failed to update employee", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Employee Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select name="departmentId" value={formData.departmentId} onChange={handleChange}>
              <option value="">Select a Department</option>
              {departments.map(dept => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditEmployeeModal;