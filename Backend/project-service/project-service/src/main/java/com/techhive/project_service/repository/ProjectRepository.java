package com.techhive.project_service.repository;

import com.techhive.project_service.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure; // Import this
import org.springframework.data.repository.query.Param; // Import this
import org.springframework.stereotype.Repository;

import java.time.LocalDate; // Import this
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    // <<<--- ADD THIS METHOD ---<<<
    @Procedure(procedureName = "ADD_PROJECT_SP")
    String addProjectProcedure(
            @Param("p_project_name") String projectName,
            @Param("p_description") String description,
            @Param("p_start_date") LocalDate startDate,
            @Param("p_end_date") LocalDate endDate,
            @Param("p_status") String status
    );
    @Procedure(procedureName = "UPDATE_PROJECT_STATUS_SP")
    long updateProjectStatusProcedure(
            @Param("p_project_id") String projectId,
            @Param("p_new_status") String newStatus
    );

    // <<<--- AND ADD THIS METHOD ---<<<
    @Procedure(procedureName = "DELETE_PROJECT_SP")
    long deleteProjectProcedure(
            @Param("p_project_id") String projectId
    );

    // <<<--- ADD THIS METHOD ---<<<
    @Procedure(name = "getAllProjects")
    List<Project> getAllProjectsProcedure();

    // <<<--- AND ADD THIS METHOD ---<<<
    @Procedure(name = "getProjectById")
    List<Project> getProjectByIdProcedure(@Param("p_project_id") String projectId);

    @Procedure(procedureName = "UPDATE_PROJECT_SP")
    long updateProjectProcedure(
            @Param("p_project_id") String projectId,
            @Param("p_project_name") String projectName,
            @Param("p_description") String description,
            @Param("p_start_date") LocalDate startDate,
            @Param("p_end_date") LocalDate endDate,
            @Param("p_status") String status
    );
}