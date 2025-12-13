package com.techhive.employee_service.dto;
import lombok.Data;
import lombok.NoArgsConstructor; // Make sure this is present
import lombok.AllArgsConstructor; // This is optional but good to have

@Data
@NoArgsConstructor // The no-argument constructor
@AllArgsConstructor // The all-argument constructor

public class DepartmentEmployeeDTO {
    private String employeeId;
    private String firstName;
    private String lastName;
    private String jobTitle;
}