// src/components/EditSalaryModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

function EditSalaryModal({ show, onHide, onEditSuccess, employeeData }) {
  // State for the form fields
  const [amount, setAmount] = useState('');
  const [payFrequency, setPayFrequency] = useState('ANNUALLY'); // Default value
  const [effectiveDate, setEffectiveDate] = useState('');

  // This useEffect populates the form when an employee is selected
  useEffect(() => {
    if (employeeData) {
      // If employee already has a salary, fill the form with it
      if (employeeData.amount) {
        setAmount(employeeData.amount);
        setPayFrequency(employeeData.payFrequency);
        setEffectiveDate(employeeData.effectiveDate ? new Date(employeeData.effectiveDate).toISOString().split('T')[0] : '');
      } else {
        // If it's a new salary assignment, clear the form
        setAmount('');
        setPayFrequency('ANNUALLY');
        setEffectiveDate('');
      }
    }
  }, [employeeData]); // Re-run when the selected employee changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employeeData) return;

    const salaryData = {
      employeeId: employeeData.employeeId,
      amount: parseFloat(amount),
      payFrequency,
      effectiveDate,
    };

    try {
      // The same PUT endpoint works for both creating and updating (UPSERT)
      await apiClient.put('/salaries', salaryData);
      toast.success(`Salary for ${employeeData.firstName} ${employeeData.lastName} has been updated.`);
      
      onEditSuccess(); // Refresh the main table
      onHide(); // Close the modal
    } catch (error) {
      toast.error("Failed to update salary.");
      console.error("Failed to update salary:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {employeeData?.amount ? 'Edit' : 'Assign'} Salary for {employeeData?.firstName} {employeeData?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Salary Amount(LKR)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pay Frequency</Form.Label>
            <Form.Select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)}>
              <option value="ANNUALLY">ANNUALLY</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="WEEKLY">WEEKLY</option>
              <option value="HOURLY">HOURLY</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Effective Date</Form.Label>
            <Form.Control 
              type="date" 
              value={effectiveDate} 
              onChange={(e) => setEffectiveDate(e.target.value)} 
              required 
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditSalaryModal;