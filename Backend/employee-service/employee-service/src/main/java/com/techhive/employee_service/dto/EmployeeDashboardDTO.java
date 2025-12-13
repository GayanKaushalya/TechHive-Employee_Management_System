package com.techhive.employee_service.dto;

import com.techhive.employee_service.model.Salary;
import lombok.Data;
import lombok.NoArgsConstructor; // <<<--- IMPORT AND ADD THIS ANNOTATION
import lombok.AllArgsConstructor; // Also good to have

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDashboardDTO {

    // Fields from get_employee_dashboard_sp
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private Integer departmentId;
    private String departmentName;

    // This field will be populated by a separate call
    private Salary salary;

    // This field will be aggregated from the dashboard procedure results
    private List<ProjectDTO> projects = new ArrayList<>();
}