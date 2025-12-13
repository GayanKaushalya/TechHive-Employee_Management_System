package com.techhive.project_service.controller;

import com.techhive.project_service.dto.ProjectAssignmentDetailsDTO;
import com.techhive.project_service.dto.AvailableEmployeeDTO;
import com.techhive.project_service.model.ProjectAssignment;
import com.techhive.project_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments") // Note the new base path
public class ProjectAssignmentController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    public ProjectAssignmentController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/employee/{employeeId}")
    public List<ProjectAssignment> getAssignmentsByEmployeeId(@PathVariable String employeeId) {
        return projectService.getAssignmentsForEmployee(employeeId);
    }

    @GetMapping("/project/{projectId}")
    public List<ProjectAssignmentDetailsDTO> getAssignmentsByProjectId(@PathVariable String projectId) {
        return projectService.getAssignmentsForProject(projectId);
    }

    @GetMapping("/project/{projectId}/unassigned-employees")
    public List<AvailableEmployeeDTO> getUnassignedEmployees(@PathVariable String projectId) {
        return projectService.getUnassignedEmployeesForProject(projectId);
    }

    @GetMapping("/project/{projectId}/assigned-ids")
    public List<String> getAssignedEmployeeIds(@PathVariable String projectId) {
        return projectService.getAssignedEmployeeIdsForProject(projectId);
    }
}