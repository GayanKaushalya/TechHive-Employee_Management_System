// src/pages/FeedbackManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AddFeedbackModal from '../components/AddFeedbackModal';
import ViewFeedbackModal from '../components/ViewFeedbackModal';

function FeedbackManagementPage() { 
  const { user } = useOutletContext();
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [feedbackToView, setFeedbackToView] = useState(null);

  // Function to fetch the list of all feedback
  const fetchAllFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/feedback');
      setFeedbackList(response.data);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      toast.error("Could not fetch feedback data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component first loads
  useEffect(() => {
    fetchAllFeedback();
  }, []);

  // Handler for the View modal
  const handleViewClick = (feedback) => {
    setFeedbackToView(feedback);
    setShowViewModal(true);
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <h1 className="m-0">Feedback Management</h1>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">All Submitted Feedback</h3>
              <div className="card-tools">
                <button 
                  type="button" 
                  className="btn btn-tool" 
                  onClick={fetchAllFeedback}
                  disabled={isLoading}
                  title="Refresh Data"
                >
                  <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
                </button>
                {/* =============================================================== */}
                {/* <<<--- THIS IS THE MISSING BUTTON ---<<<                      */}
                {/* =============================================================== */}
                <button 
                  type="button" 
                  className="btn btn-primary ml-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="fas fa-plus"></i> Give Feedback
                </button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>From (Submitter)</th>
                      <th>For (Target)</th>
                      <th>Project</th>
                      <th>Date Submitted</th>
                      <th style={{width: '10%'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackList.map(feedback => (
                      <tr key={feedback.id}>
                        <td>{feedback.submitterEmployeeId}</td>
                        <td>{feedback.targetEmployeeId}</td>
                        <td>{feedback.projectId || 'N/A'}</td>
                        <td>
                          {format(new Date(feedback.submittedAt), 'yyyy-MM-dd HH:mm')}
                        </td>
                        <td>
                          {/* This button is now functional */}
                          <button className="btn btn-sm btn-info" onClick={() => handleViewClick(feedback)}>
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- RENDER THE MODALS --- */}
      <AddFeedbackModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddSuccess={fetchAllFeedback}
        currentUser={user} // Pass the logged-in user's info
      />
      <ViewFeedbackModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        feedbackData={feedbackToView}
      />
    </>
  );
}

export default FeedbackManagementPage;