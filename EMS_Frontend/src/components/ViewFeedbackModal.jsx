// src/components/ViewFeedbackModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { format } from 'date-fns';

function ViewFeedbackModal({ show, onHide, feedbackData }) {
  if (!feedbackData) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Feedback Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <dl className="row">
          <dt className="col-sm-4">From (Submitter ID):</dt>
          <dd className="col-sm-8">{feedbackData.submitterEmployeeId}</dd>

          <dt className="col-sm-4">For (Target ID):</dt>
          <dd className="col-sm-8">{feedbackData.targetEmployeeId}</dd>

          <dt className="col-sm-4">Project ID:</dt>
          <dd className="col-sm-8">{feedbackData.projectId || 'N/A'}</dd>

          <dt className="col-sm-4">Date Submitted:</dt>
          <dd className="col-sm-8">{format(new Date(feedbackData.submittedAt), 'yyyy-MM-dd HH:mm:ss')}</dd>
          
          <dt className="col-sm-4">Anonymous Submission:</dt>
          <dd className="col-sm-8">{feedbackData.isAnonymous ? 'Yes' : 'No'}</dd>
        </dl>
        <hr />
        <h6>Feedback Content:</h6>
        <div className="p-3 bg-light rounded">
          {/* We iterate over the 'content' object to display all its fields */}
          {Object.entries(feedbackData.content).map(([key, value]) => (
            <div key={key}>
              <strong>{key.replace('_', ' ').toUpperCase()}:</strong>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ViewFeedbackModal;