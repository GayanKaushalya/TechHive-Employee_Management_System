package com.techhive.employee_service.dto;

import lombok.AllArgsConstructor; // <<<--- IMPORT THIS
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // <<<--- ADD THIS ANNOTATION
public class ProjectDTO {
    private String projectId;
    private String projectName;
    private String projectStatus;
}