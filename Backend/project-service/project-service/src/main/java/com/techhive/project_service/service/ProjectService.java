package com.techhive.project_service.service;

import com.techhive.project_service.model.Project;
import com.techhive.project_service.model.ProjectAssignment;
import com.techhive.project_service.repository.ProjectAssignmentRepository;
import com.techhive.project_service.dto.ProjectAssignmentDetailsDTO;
import com.techhive.project_service.dto.AvailableEmployeeDTO;
import com.techhive.project_service.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectAssignmentRepository projectAssignmentRepository;

    public Project createProject(Project project) {
        // Step 1: Handle application-level business logic, like setting a default status.
        String status = project.getStatus();
        if (status == null || status.isEmpty()) {
            status = "PENDING";
        }

        // Step 2: Call the repository method that executes the 'add_project_sp' stored procedure.
        String generatedId = projectRepository.addProjectProcedure(
                project.getProjectName(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                status // Use the potentially defaulted status
        );
        // Step 3: Set the database-generated ID and the final status on the object.
        project.setProjectId(generatedId);
        project.setStatus(status);

        // Step 4: Return the complete project object to the controller.
        return project;
    }


    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.getAllProjectsProcedure();
    }

    @Transactional(readOnly = true)
    public Optional<Project> getProjectById(String projectId) {
        List<Project> projects = projectRepository.getProjectByIdProcedure(projectId);
        return projects.stream().findFirst();
    }

    // This method now calls the assign stored procedure
    public ProjectAssignment assignEmployeeToProject(String projectId, String employeeId) {
        Long newAssignmentId = projectAssignmentRepository.assignEmployeeProcedure(projectId, employeeId);

        // Build a complete object to return to the controller for the API response
        ProjectAssignment result = new ProjectAssignment();
        result.setAssignmentId(newAssignmentId);
        result.setProjectId(projectId);
        result.setEmployeeId(employeeId);
        return result;
    }

    // This method now calls the dismiss stored procedure
    @Transactional
    public long dismissEmployeeFromProject(String projectId, String employeeId) {
        return projectAssignmentRepository.dismissEmployeeProcedure(projectId, employeeId);
    }

    @Transactional
    public long updateProjectStatus(String projectId, String newStatus) {
        // Here you could add validation, e.g., checking if the status string is valid.
        // For now, we'll pass it directly to the stored procedure.
        return projectRepository.updateProjectStatusProcedure(projectId, newStatus.toUpperCase());
    }

    // <<<--- AND ADD THIS METHOD ---<<<
    @Transactional
    public long deleteProject(String projectId) {
        return projectRepository.deleteProjectProcedure(projectId);
    }

    @Transactional(readOnly = true)
    public List<ProjectAssignment> getAssignmentsForEmployee(String employeeId) {
        return projectAssignmentRepository.getAssignmentsByEmployeeProcedure(employeeId);
    }

    @Transactional
    public long updateProject(String projectId, Project projectDetails) {
        return projectRepository.updateProjectProcedure(
                projectId,
                projectDetails.getProjectName(),
                projectDetails.getDescription(),
                projectDetails.getStartDate(),
                projectDetails.getEndDate(),
                projectDetails.getStatus()
        );
    }

    @Transactional(readOnly = true)
    public List<ProjectAssignmentDetailsDTO> getAssignmentsForProject(String projectId) {
        return projectAssignmentRepository.getAssignmentsByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public List<AvailableEmployeeDTO> getUnassignedEmployeesForProject(String projectId) {
        return projectAssignmentRepository.getUnassignedEmployees(projectId);
    }

    @Transactional(readOnly = true)
    public List<String> getAssignedEmployeeIdsForProject(String projectId) {
        return projectAssignmentRepository.getAssignedEmployeeIdsForProject(projectId);
    }

}