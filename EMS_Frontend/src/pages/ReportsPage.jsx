// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

// A reusable component for each report card
const ReportCard = ({ title, description, icon, onGenerate, isGenerating }) => (
  <div className="col-md-6">
    <div className="card card-primary card-outline">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <i className={`fas ${icon} fa-3x text-primary`}></i>
          </div>
          <div>
            <h5 className="card-title text-bold">{title}</h5>
            <p className="card-text text-muted">{description}</p>
          </div>
          <div className="ml-auto">
            <button 
              className="btn btn-primary" 
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="sr-only"> Generating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i> Generate PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);


function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

   const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');


  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        // Fetch projects and departments in parallel
        const [projectsResponse, departmentsResponse] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/departments')
        ]);
        setProjects(projectsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Failed to fetch initial page data", error);
        toast.error("Could not load data for report dropdowns.");
      }
    };
    fetchDataForDropdowns();
  }, []);

  // Generic function to handle the download logic for any report
  const handleDownload = async (url, defaultFileName) => {
    setIsGenerating(true);
    toast.info("Generating your report... Please wait.");
    
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob', // IMPORTANT: Tell Axios to expect binary file data
      });

      // Create a URL for the blob data
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', defaultFileName); // Set the default filename
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the URL
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(fileURL);
      
    } catch (error) {
      console.error(`Failed to generate report from ${url}`, error);
      toast.error("Failed to generate the report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProjectAssignmentReport = () => {
    if (!selectedProjectId) {
      toast.warn("Please select a project first.");
      return;
    }
    const url = `/reports/projects/${selectedProjectId}/assignments`;
    const fileName = `project_${selectedProjectId}_assignments.pdf`;
    handleDownload(url, fileName);
  };

  const handleGenerateDepartmentReport = () => {
    if (!selectedDepartmentId) {
      toast.warn("Please select a department first.");
      return;
    }
    const url = `/reports/departments/${selectedDepartmentId}/details`;
    const fileName = `department_${selectedDepartmentId}_report.pdf`;
    handleDownload(url, fileName);
  };


  // This is the full JSX to be returned by your ReportsPage component

   return (
    <>
      
      <section className="content">
        <div className="container-fluid">
          {/* --- Static Reports --- */}
          <h4 className="mt-4 mb-2">Standard Reports</h4>
          <div className="row">
            <ReportCard 
              title="Employee Directory"
              description="A list of all employees, their roles, and departments."
              icon="fa-users"
              isGenerating={isGenerating}
              onGenerate={() => handleDownload('/reports/employees/directory', 'employee_directory.pdf')}
            />
            <ReportCard 
              title="Master Salary Report"
              description="Confidential. A complete list of all employee salaries."
              icon="fa-dollar-sign"
              isGenerating={isGenerating}
              onGenerate={() => handleDownload('/reports/salaries/master', 'master_salary_report.pdf')}
            />
            <ReportCard 
              title="Project Status Report"
              description="An overview of all projects and their current status."
              icon="fa-project-diagram"
              isGenerating={isGenerating}
              onGenerate={() => handleDownload('/reports/projects/status', 'project_status_report.pdf')}
            />
          </div>

          {/* --- Dynamic / Filtered Reports --- */}
          <h4 className="mt-4 mb-2">Filtered Reports</h4>
          <div className="row">
            {/* --- Individual Project Report Card (Unchanged) --- */}
            <div className="col-lg-6 mb-4">
              <div className="card card-info card-outline h-100">
                <div className="card-header"><h3 className="card-title text-bold">Individual Project Report</h3></div>
                <div className="card-body">
                  <p className="card-text text-muted">Select a project to generate a detailed report of its team members.</p>
                  <div className="input-group">
                    <select className="form-control" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                      <option value="">-- Select a Project --</option>
                      {projects.map(p => (<option key={p.projectId} value={p.projectId}>{p.projectName}</option>))}
                    </select>
                    <div className="input-group-append">
                      <button className="btn btn-success" onClick={handleGenerateProjectAssignmentReport} disabled={isGenerating || !selectedProjectId}>
                        <i className="fas fa-download"></i> Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* <<<--- THIS IS THE NEW CARD FOR THE DEPARTMENT REPORT ---<<<     */}
            {/* =============================================================== */}
            <div className="col-lg-6 mb-4">
              <div className="card card-info card-outline h-100">
                <div className="card-header"><h3 className="card-title text-bold">Individual Department Report</h3></div>
                <div className="card-body">
                  <p className="card-text text-muted">Select a department to generate a detailed report of its members.</p>
                  <div className="input-group">
                    <select className="form-control" value={selectedDepartmentId} onChange={(e) => setSelectedDepartmentId(e.target.value)}>
                      <option value="">-- Select a Department --</option>
                      {departments.map(d => (<option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>))}
                    </select>
                    <div className="input-group-append">
                      <button className="btn btn-success" onClick={handleGenerateDepartmentReport} disabled={isGenerating || !selectedDepartmentId}>
                        <i className="fas fa-download"></i> Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReportsPage;