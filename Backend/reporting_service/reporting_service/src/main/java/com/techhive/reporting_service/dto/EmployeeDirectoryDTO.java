package com.techhive.reporting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// This DTO matches the columns from our get_employee_directory_data_sp procedure
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDirectoryDTO {
    private String employeeId;
    private String fullName;
    private String email;
    private String jobTitle;
    private LocalDate hireDate;
    private String departmentName;
}