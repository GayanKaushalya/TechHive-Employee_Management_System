// src/pages/SalaryManagementPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import EditSalaryModal from '../components/EditSalaryModal'; // Import the modal

import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

function SalaryManagementPage() {
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEditSalary, setEmployeeToEditSalary] = useState(null);

  const fetchEmployeeSalaries = async () => {
    try {
      const response = await apiClient.get('/salaries');
      setEmployeeSalaries(response.data);
    } catch (error) {
      toast.error("Could not fetch salary data.");
      console.error("Failed to fetch salaries:", error);
    }
  };


  useEffect(() => {
    const dt = $(tableRef.current).DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: false,
      pageLength: 5, // I noticed you had 5 in other tables, changed for consistency
      lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
      pagingType: "simple_numbers",

      
      // ===============================================================
      // <<<--- THIS IS THE UPDATED COLUMNS SECTION ---<<<
      // ===============================================================
      columns: [
        { data: 'employeeId' },
        { data: null, render: (data, type, row) => `${row.firstName} ${row.lastName}` },
        { 
          data: 'amount', 
          render: (data) => {
            if (data === null || data === undefined) {
              return '<span class="text-muted">Not Set</span>';
            }
            // Format as LKR with commas
            return `LKR ${Number(data).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        { 
          data: 'payFrequency', 
          defaultContent: '<span class="text-muted">Not Set</span>',
          // Render the frequency as a badge
          render: (data) => {
            if (!data) return '<span class="text-muted">Not Set</span>';
            
            let badgeClass = 'bg-info'; // Default for MONTHLY/WEEKLY
            if (data === 'ANNUALLY') {
              badgeClass = 'bg-primary';
            } else if (data === 'HOURLY') {
              badgeClass = 'bg-secondary';
            }
            return `<span class="badge ${badgeClass}">${data}</span>`;
          }
        },
        { data: 'effectiveDate', defaultContent: '<span class="text-muted">Not Set</span>' },
        {
          data: null,
          orderable: false,
          // Conditionally render "Assign" or "Edit" button (Unchanged)
          render: (data, type, row) => {
            if (row.amount == null) {
              return `<button class="btn btn-success btn-sm assign-btn">
                        <i class="fas fa-plus-circle mr-1"></i> Assign Salary
                      </button>`;
            } else {
              return `<button class="btn btn-warning btn-sm edit-btn">
                        <i class="fas fa-edit mr-1"></i> Edit Salary
                      </button>`;
            }
          }
        }
      ]
    });
    dataTableRef.current = dt;

    const tableBody = $(tableRef.current).find('tbody');
    tableBody.on('click', '.assign-btn, .edit-btn', function() {
      const rowData = dt.row($(this).closest('tr')).data();
      handleEditClick(rowData);
    });

    
    fetchEmployeeSalaries();

    return () => { 
      tableBody.off('click', '.assign-btn, .edit-btn');
      if (dataTableRef.current) { 
        dataTableRef.current.destroy(); 
      }
    };
  }, []);


  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.clear().rows.add(employeeSalaries).draw();
    }
  }, [employeeSalaries]);

  // Handlers for the modal (Unchanged)
  const handleEditClick = (employee) => {
    setEmployeeToEditSalary(employee);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEmployeeToEditSalary(null);
  };


  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">List of All Employee Salaries</h3>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" onClick={fetchEmployeeSalaries} title="Refresh Data">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <table ref={tableRef} className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Emp. ID</th>
                    <th>Employee Name</th>
                    <th>Amount(LKR)</th>
                    <th>Frequency</th>
                    <th>Effective Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Render the modal (Unchanged) */}
      <EditSalaryModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onEditSuccess={fetchEmployeeSalaries}
        employeeData={employeeToEditSalary}
      />
    </>
  );
}

export default SalaryManagementPage;