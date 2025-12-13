package com.techhive.employee_service.dto;

import lombok.Data;

@Data
public class ProjectAssignmentDTO {
    private Long assignmentId;
    private String projectId;
    private String employeeId;
}