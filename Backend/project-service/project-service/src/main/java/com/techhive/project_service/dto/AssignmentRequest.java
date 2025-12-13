package com.techhive.project_service.dto;

import lombok.Data;

@Data
public class AssignmentRequest {
    private String projectId;
    private String employeeId;
}