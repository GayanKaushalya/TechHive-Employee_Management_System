// src/pages/EmployeeFeedbackPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useOutletContext } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AddFeedbackModal from '../components/AddFeedbackModal';
import ViewFeedbackModal from '../components/ViewFeedbackModal';

function EmployeeFeedbackPage() {
  const { user } = useOutletContext();
  const [feedbackGiven, setFeedbackGiven] = useState([]);
  const [feedbackReceived, setFeedbackReceived] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [feedbackToView, setFeedbackToView] = useState(null);

  // --- THIS IS THE FIX ---
  // We wrap the fetchData function in useCallback.
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [givenRes, receivedRes] = await Promise.all([
        apiClient.get(`/feedback/by/${user.id}`),
        apiClient.get(`/feedback/for/${user.id}`)
      ]);
      setFeedbackGiven(givenRes.data);
      setFeedbackReceived(receivedRes.data);
    } catch (error) {
      toast.error("Could not load feedback history.");
      console.error("Failed to fetch feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // The function itself now depends on the 'user' object.

  // The useEffect hook now correctly includes 'fetchData' in its dependency array.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewClick = (feedback) => {
    setFeedbackToView(feedback);
    setShowViewModal(true);
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0">Feedback Center</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* --- Main Card with Tabs --- */}
              <div className="card">
                <div className="card-header d-flex p-0">
                  <h3 className="card-title p-3">My Feedback</h3>
                  <ul className="nav nav-pills ml-auto p-2">
                    <li className="nav-item"><a className="nav-link active" href="#tab_1" data-toggle="tab">Feedback I've Received</a></li>
                    <li className="nav-item"><a className="nav-link" href="#tab_2" data-toggle="tab">Feedback I've Given</a></li>
                    <li className="nav-item">
                      <button className="btn btn-primary ml-2" onClick={() => setShowAddModal(true)}>
                        <i className="fas fa-plus mr-1"></i> Give New Feedback
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                    {/* --- Tab 1: Feedback Received --- */}
                    <div className="tab-pane active" id="tab_1">
                      {isLoading ? <p>Loading...</p> : (
                        <FeedbackTable feedbackList={feedbackReceived} onActionClick={handleViewClick} perspective="submitter" />
                      )}
                    </div>
                    {/* --- Tab 2: Feedback Given --- */}
                    <div className="tab-pane" id="tab_2">
                      {isLoading ? <p>Loading...</p> : (
                        <FeedbackTable feedbackList={feedbackGiven} onActionClick={handleViewClick} perspective="target" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddFeedbackModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddSuccess={fetchData} // Refresh data after adding
        currentUser={user}
      />
      <ViewFeedbackModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        feedbackData={feedbackToView}
      />
    </>
  );
}

// Reusable table component (Unchanged)
const FeedbackTable = ({ feedbackList, onActionClick, perspective }) => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th>{perspective === 'target' ? 'To Employee' : 'From Employee'}</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {feedbackList.length > 0 ? (
        feedbackList.map(fb => (
          <tr key={fb.id}>
            <td>{perspective === 'target' ? fb.targetEmployeeId : (fb.isAnonymous ? 'Anonymous' : fb.submitterEmployeeId)}</td>
            <td>{format(new Date(fb.submittedAt), 'yyyy-MM-dd')}</td>
            <td><button className="btn btn-sm btn-info" onClick={() => onActionClick(fb)}>View</button></td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="3" className="text-center text-muted">No feedback to display.</td></tr>
      )}
    </tbody>
  </table>
);

export default EmployeeFeedbackPage;