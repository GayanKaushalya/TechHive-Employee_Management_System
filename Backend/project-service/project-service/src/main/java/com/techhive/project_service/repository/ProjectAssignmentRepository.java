package com.techhive.project_service.repository;

import com.techhive.project_service.model.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long>, ProjectAssignmentRepositoryCustom {

    @Procedure(procedureName = "ASSIGN_EMPLOYEE_TO_PROJECT_SP")
    Long assignEmployeeProcedure(
            @Param("p_project_id") String projectId,
            @Param("p_employee_id") String employeeId
    );

    @Procedure(procedureName = "DISMISS_EMPLOYEE_FROM_PROJECT_SP")
    long dismissEmployeeProcedure(
            @Param("p_project_id") String projectId,
            @Param("p_employee_id") String employeeId
    );

    @Procedure(procedureName = "GET_ASSIGNMENTS_BY_EMPLOYEE_SP")
    List<ProjectAssignment> getAssignmentsByEmployeeProcedure(@Param("p_employee_id") String employeeId);
}