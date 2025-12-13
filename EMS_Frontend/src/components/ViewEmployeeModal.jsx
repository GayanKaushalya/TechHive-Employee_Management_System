// src/components/ViewEmployeeModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// This component receives props to control it and the employee data to display
function ViewEmployeeModal({ show, onHide, employeeData }) {

  // A small helper to render a row in our details list
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

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Employee Details - {employeeData?.firstName} {employeeData?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {employeeData ? (
          <div className="container-fluid">
            <DetailRow label="Employee ID" value={employeeData.employeeId} />
            <DetailRow label="Full Name" value={`${employeeData.firstName} ${employeeData.lastName}`} />
            <DetailRow label="Email" value={employeeData.email} />
            <DetailRow label="Job Title" value={employeeData.jobTitle} />
            <DetailRow label="Department" value={employeeData.departmentName} />
            <DetailRow label="Hire Date" value={employeeData.hireDate} />
            <DetailRow label="Account Status" value={employeeData.accountStatus?.replace('_', ' ')} />
            <DetailRow label="Role" value={employeeData.role} />
          </div>
        ) : (
          <p>No employee data available.</p>
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

export default ViewEmployeeModal;