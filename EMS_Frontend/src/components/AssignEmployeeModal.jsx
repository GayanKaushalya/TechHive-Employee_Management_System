// src/components/AssignEmployeeModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function AssignEmployeeModal({ show, onHide, projectData, onAssignmentChange }) {
  const [availableEmployees, setAvailableEmployees] = useState([]); 
  const [assignedTeam, setAssignedTeam] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);
  const [assignmentToDismiss, setAssignmentToDismiss] = useState(null);


  // =======================================================================
  // <<<--- THIS IS THE UPDATED fetchData FUNCTION ---<<<
  // =======================================================================
  const fetchData = useCallback(async () => {
    if (!projectData) return;
    setIsLoading(true);
    try {
      // Step 1: Fetch the AVAILABLE employees and the CURRENTLY ASSIGNED team in parallel.
      const availableEmployeesPromise = apiClient.get('/employees/available');
      const assignedTeamPromise = apiClient.get(`/assignments/project/${projectData.projectId}`);
      
      const [availableEmployeesResponse, assignedTeamResponse] = await Promise.all([
        availableEmployeesPromise,
        assignedTeamPromise
      ]);

      // Step 2: Set the state with the data from our new, smart backend endpoints.
      setAvailableEmployees(availableEmployeesResponse.data);
      setAssignedTeam(assignedTeamResponse.data);

    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Could not load project or employee data.");
    } finally {
      setIsLoading(false);
    }
  }, [projectData]);

  
  // This useEffect hook is correct and does not need changes.
  useEffect(() => {
    if (show) {
      fetchData();
    }
    return () => {
      setAssignedTeam([]);
      setAvailableEmployees([]);
      setSelectedEmployeeId('');
    };
  }, [show, projectData, fetchData]);


  // --- This handleSubmit function is unchanged ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedEmployeeId) {
      toast.warn("Please select an employee to assign.");
      return;
    }
    const assignmentData = { projectId: projectData.projectId, employeeId: selectedEmployeeId };
    try {
      await apiClient.post('/projects/assignments', assignmentData);
      toast.success(`Employee assigned successfully.`);
      setSelectedEmployeeId('');
      fetchData(); // Refresh both lists inside the modal
      onAssignmentChange(); // Notify parent to refresh the main table
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("This employee is already assigned to this project.");
      } else {
        toast.error("Failed to assign employee.");
      }
    }
  };

  // --- The dismiss logic functions are unchanged ---
  const handleDismissClick = (assignment) => {
    setAssignmentToDismiss(assignment);
    setShowDismissConfirm(true);
  };
  const handleCloseDismissConfirm = () => {
    setShowDismissConfirm(false);
    setAssignmentToDismiss(null);
  };
  const handleConfirmDismiss = async () => {
    if (!assignmentToDismiss) return;
    try {
      await apiClient.delete('/projects/assignments', { 
        data: { 
          projectId: projectData.projectId, 
          employeeId: assignmentToDismiss.employeeId 
        } 
      });
      toast.success("Employee dismissed successfully.");
      handleCloseDismissConfirm();
      fetchData(); // Refresh both lists inside the modal
      onAssignmentChange(); // Notify parent to refresh the main table
    } catch(err) {
      console.error("Failed to dismiss employee:", err);
      toast.error("Failed to dismiss employee.");
      handleCloseDismissConfirm();
    }
  };


  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Project Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 p-3 bg-light rounded">
              <h5>{projectData?.projectName}</h5>
              <p className="text-muted mb-0">{projectData?.description || 'No description available.'}</p>
          </div>
          
          <h6>Current Team</h6>
          {isLoading ? <p>Loading team...</p> : (
            assignedTeam.length > 0 ? (
              <ul className="list-group mb-4">
                {assignedTeam.map(member => (
                  <li key={member.assignmentId} className="list-group-item d-flex justify-content-between align-items-center">
                    {member.fullName} ({member.employeeId})
                    <button className="btn btn-sm btn-outline-danger" title="Dismiss from project" onClick={() => handleDismissClick(member)}>
                        <i className="fas fa-times"></i> Dismiss
                    </button>
                  </li>
                ))}
              </ul>
            ) : ( <p className="text-muted mb-4">No employees are assigned to this project.</p> )
          )}
          
          <hr/>

          <h6>Assign a New Employee</h6>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Available Employees</Form.Label>
              {isLoading ? (
                <p>Loading employees...</p>
              ) : (
                <Form.Select 
                  value={selectedEmployeeId} 
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                >
                  <option value="">-- Choose an employee --</option>
                   {availableEmployees.map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={onHide}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading} className="ml-2">
                Assign Employee
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmationModal
          show={showDismissConfirm}
          onHide={handleCloseDismissConfirm}
          onConfirm={handleConfirmDismiss}
          message={`Are you sure you want to dismiss ${assignmentToDismiss?.fullName} (${assignmentToDismiss?.employeeId}) from this project?`}
      />
    </>
  );
}

export default AssignEmployeeModal;