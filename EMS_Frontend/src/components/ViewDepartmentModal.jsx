// src/components/ViewDepartmentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function ViewDepartmentModal({ show, onHide, departmentData }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && departmentData) {
      const fetchMembers = async () => {
        setIsLoading(true);
        try {
          // This calls the new backend endpoint we need to create
          const response = await apiClient.get(`/employees/by-department/${departmentData.departmentId}`);
          setMembers(response.data);
        } catch (error) {
          console.error("Failed to fetch department members", error);
          toast.error("Could not load department members.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMembers();
    }
  }, [show, departmentData]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Department Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {departmentData ? (
          <div>
            <dl className="row">
              <dt className="col-sm-4">Department Name:</dt>
              <dd className="col-sm-8">{departmentData.departmentName}</dd>
              <dt className="col-sm-4">Total Employees:</dt>
              <dd className="col-sm-8">{departmentData.employeeCount}</dd>
            </dl>
            <hr />
            <h5>Members of this Department</h5>
            {isLoading ? <p>Loading members...</p> : (
              members.length > 0 ? (
                <ul className="list-group">
                  {members.map(member => (
                    <li key={member.employeeId} className="list-group-item">
                      {member.firstName} {member.lastName} ({member.employeeId}) - <span className="text-muted">{member.jobTitle}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No employees are currently assigned to this department.</p>
              )
            )}
          </div>
        ) : <p>No data available.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewDepartmentModal;