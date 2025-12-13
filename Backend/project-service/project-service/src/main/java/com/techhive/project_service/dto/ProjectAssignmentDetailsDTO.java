package com.techhive.project_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This DTO will hold the result from our new stored procedure
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAssignmentDetailsDTO {
    private Long assignmentId;
    private String projectId;
    private String employeeId;
    private String fullName;
}