package com.techhive.project_service.repository;

import com.techhive.project_service.dto.ProjectAssignmentDetailsDTO;
import com.techhive.project_service.dto.AvailableEmployeeDTO;
import java.util.List;

public interface ProjectAssignmentRepositoryCustom {
    List<ProjectAssignmentDetailsDTO> getAssignmentsByProjectId(String projectId);

    List<AvailableEmployeeDTO> getUnassignedEmployees(String projectId);

    List<String> getAssignedEmployeeIdsForProject(String projectId);
}