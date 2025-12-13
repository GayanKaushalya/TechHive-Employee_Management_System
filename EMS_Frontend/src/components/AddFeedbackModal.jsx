// src/components/AddFeedbackModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function AddFeedbackModal({ show, onHide, onAddSuccess, currentUser }) {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]); // <<<--- NEW STATE for projects
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [projectId, setProjectId] = useState(''); // This state was already here, now we'll use it
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // The useEffect now fetches both employees and projects
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          // Fetch both lists in parallel for better performance
          const [employeesResponse, projectsResponse] = await Promise.all([
            apiClient.get('/employees'),
            apiClient.get('/projects')
          ]);
          setEmployees(employeesResponse.data);
          setProjects(projectsResponse.data);
        } catch (err) {
          console.error("Could not load data for modal:", err);
          toast.error("Could not load necessary data.");
        }
      };
      fetchData();
    }
  }, [show]);

  const clearForm = () => {
    setTargetEmployeeId('');
    setProjectId('');
    setIsAnonymous(false);
    setComment('');
    setSuggestion('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const feedbackData = {
      submitterEmployeeId: currentUser.id,
      targetEmployeeId,
      // Use the projectId from state, send null if it's an empty string
      projectId: projectId || null, 
      isAnonymous,
      content: { 
        comment: comment,
        suggestion: suggestion
      }
    };
    
    try {
      await apiClient.post('/feedback', feedbackData);
      toast.success("Feedback submitted successfully!");
      onAddSuccess();
      onHide();
      clearForm();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Give Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>To Employee</Form.Label>
            <Form.Select value={targetEmployeeId} onChange={e => setTargetEmployeeId(e.target.value)} required>
              <option value="">-- Select an Employee --</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* =============================================================== */}
          {/* <<<--- THIS IS THE NEWLY ADDED FORM GROUP ---<<<                */}
          {/* =============================================================== */}
          <Form.Group className="mb-3">
            <Form.Label>Related Project (Optional)</Form.Label>
            <Form.Select value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select a Project --</option>
              {projects.map(proj => (
                <option key={proj.projectId} value={proj.projectId}>
                  {proj.projectName} ({proj.projectId})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Feedback Comment</Form.Label>
            <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} required placeholder="What went well?" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Suggestion for Improvement</Form.Label>
            <Form.Control as="textarea" rows={3} value={suggestion} onChange={e => setSuggestion(e.target.value)} placeholder="What could be improved?" />
          </Form.Group>
          
          {/* --- This is the anonymous checkbox from your screenshot --- */}
          <Form.Group className="mb-3">
             <Form.Check 
                type="checkbox"
                label="Submit feedback anonymously"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
             />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="mr-2">Cancel</Button>
            <Button type="submit" variant="primary">Submit Feedback</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddFeedbackModal;