// src/components/ViewProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function ViewProjectModal({ show, onHide, projectData }) {
  const [assignedTeam, setAssignedTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && projectData) {
      const fetchTeam = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/assignments/project/${projectData.projectId}`);
          setAssignedTeam(response.data);
        } catch (error) {
          console.error("Failed to fetch assigned team", error);
          toast.error("Could not load the project's team members.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTeam();
    }
  }, [show, projectData]);

  // A helper to render a row in our details list
  const DetailRow = ({ label, value }) => (
    <div className="row mb-2">
      <div className="col-sm-4">
        <strong>{label}:</strong>
      </div>
      <div className="col-sm-8">
        {value || 'N/A'}
      </div>
    </div>
  );

  const renderStatusBadge = (status) => {
    let badgeClass = 'bg-secondary'; // Default color
    if (status === 'IN-PROGRESS') {
      badgeClass = 'bg-primary';
    } else if (status === 'COMPLETED') {
      badgeClass = 'bg-success';
    } else if (status === 'PENDING') {
      badgeClass = 'bg-warning';
    }
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {projectData ? (
          <div className="container-fluid">
            <DetailRow label="Project ID" value={projectData.projectId} />
            <DetailRow label="Project Name" value={projectData.projectName} />
            <DetailRow label="Description" value={projectData.description} />
            <DetailRow label="Status" value={renderStatusBadge(projectData.status)} />
            <DetailRow label="Start Date" value={projectData.startDate} />
            <DetailRow label="End Date" value={projectData.endDate} />

            <hr className="my-4" />

            <h5>Assigned Team</h5>
            {isLoading ? (
              <p>Loading team members...</p>
            ) : (
              assignedTeam.length > 0 ? (
                <ul className="list-group">
                  {assignedTeam.map(member => (
                    <li key={member.assignmentId} className="list-group-item">
                      {member.fullName} ({member.employeeId})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No employees are assigned to this project.</p>
              )
            )}
          </div>
        ) : (
          <p>No project data available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewProjectModal;