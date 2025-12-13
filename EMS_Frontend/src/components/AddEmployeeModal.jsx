// src/components/AddEmployeeModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

// <<<--- ADD THE NEW PROP ---<<<
function AddEmployeeModal({ show, onHide, onAddSuccess, onCredentialsReceived }) {
  // State for the form fields (Unchanged)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  // State to hold the list of available departments (Unchanged)
  const [departments, setDepartments] = useState([]);

  // useEffect to fetch departments (Unchanged)
  useEffect(() => {
    if (show) {
      const fetchDepartments = async () => {
        try {
          const response = await apiClient.get('/departments');
          setDepartments(response.data);
        } catch (error) {
          console.error("Failed to fetch departments", error);
          toast.error("Could not load departments.");
        }
      };
      fetchDepartments();
    }
  }, [show]);

  // Function to clear the form fields (Unchanged)
  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setJobTitle('');
    setHireDate('');
    setDepartmentId('');
  };

  // =======================================================================
  // <<<--- THIS IS THE CORRECTED handleSubmit FUNCTION ---<<<
  // =======================================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEmployeeData = {
      firstName,
      lastName,
      email,
      jobTitle,
      hireDate,
      departmentId: departmentId ? parseInt(departmentId, 10) : null,
    };

    try {
      const createResponse = await apiClient.post('/employees', newEmployeeData);
      const newEmployee = createResponse.data;
      
      // We don't toast here anymore, the parent will.
      
      // Fetch credentials for the newly created employee
      const credentialsResponse = await apiClient.get(`/employees/${newEmployee.employeeId}/credentials`);
      
      // Pass the credentials back to the parent page
      onCredentialsReceived(credentialsResponse.data);

      clearForm();
      onAddSuccess(); // Refresh the main table
      onHide(); // Close this "Add" modal
    } catch (error) {
      console.error("Failed to create employee", error);
      toast.error(error.response?.data?.message || "Failed to create employee.");
    }
  };

  return (
    // The JSX for the Modal form is completely unchanged
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* ... All Form.Group elements are unchanged ... */}
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hire Date</Form.Label>
            <Form.Control type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
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
            Save Employee
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddEmployeeModal;