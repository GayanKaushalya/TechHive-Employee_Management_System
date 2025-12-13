package com.techhive.employee_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableEmployeeDTO {
    private String employeeId;
    private String firstName;
    private String lastName;
    private String jobTitle;
}