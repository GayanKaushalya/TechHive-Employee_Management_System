package com.techhive.project_service.controller;

import com.techhive.project_service.dto.AssignmentRequest;
import com.techhive.project_service.model.Project;
import com.techhive.project_service.model.ProjectAssignment;
import com.techhive.project_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project newProject = projectService.createProject(project);
        return new ResponseEntity<>(newProject, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable String projectId) {
        return projectService.getProjectById(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/assignments")
    public ResponseEntity<ProjectAssignment> assignEmployee(@RequestBody AssignmentRequest assignmentRequest) {
        ProjectAssignment newAssignment = projectService.assignEmployeeToProject(
                assignmentRequest.getProjectId(),
                assignmentRequest.getEmployeeId()
        );
        return new ResponseEntity<>(newAssignment, HttpStatus.CREATED);
    }

    @DeleteMapping("/assignments")
    public ResponseEntity<Void> dismissEmployee(@RequestBody AssignmentRequest dismissalRequest) {
        long deletedCount = projectService.dismissEmployeeFromProject(
                dismissalRequest.getProjectId(),
                dismissalRequest.getEmployeeId()
        );

        if (deletedCount > 0) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PatchMapping("/{projectId}/status")
    public ResponseEntity<Void> updateProjectStatus(
            @PathVariable String projectId,
            @RequestBody String newStatus) {

        // The request body will be a simple string like "IN-PROGRESS"
        long updatedCount = projectService.updateProjectStatus(projectId, newStatus);

        if (updatedCount > 0) {
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // <<<--- AND ADD THIS METHOD ---<<<
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectId) {
        long deletedCount = projectService.deleteProject(projectId);

        if (deletedCount > 0) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Void> updateProject(
            @PathVariable String projectId,
            @RequestBody Project projectDetails) {

        long updatedCount = projectService.updateProject(projectId, projectDetails);

        if (updatedCount > 0) {
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}