// src/components/NewEmployeeInfoModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function NewEmployeeInfoModal({ show, onHide, newEmployeeInfo }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Password copied to clipboard!");
  };

  if (!newEmployeeInfo) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-success">
          <i className="fas fa-check-circle mr-2"></i> Employee Created Successfully
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Provide these credentials to the new employee for account activation.</p>
        <dl className="row">
          <dt className="col-sm-5">Employee ID</dt>
          <dd className="col-sm-7">{newEmployeeInfo.employeeId}</dd>
          <dt className="col-sm-5">Temporary Password</dt>
          <dd className="col-sm-7">
            <code>{newEmployeeInfo.temporaryPassword}</code>
            <button 
              className="btn btn-sm btn-outline-secondary ml-2"
              title="Copy to clipboard"
              onClick={() => copyToClipboard(newEmployeeInfo.temporaryPassword)}
            >
              <i className="fas fa-copy"></i> Copy
            </button>
          </dd>
        </dl>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewEmployeeInfoModal;