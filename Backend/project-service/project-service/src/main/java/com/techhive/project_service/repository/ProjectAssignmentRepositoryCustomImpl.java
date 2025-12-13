package com.techhive.project_service.repository;

import com.techhive.project_service.dto.ProjectAssignmentDetailsDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;
import com.techhive.project_service.dto.AvailableEmployeeDTO;
import jakarta.persistence.ParameterMode;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProjectAssignmentRepositoryCustomImpl implements ProjectAssignmentRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<ProjectAssignmentDetailsDTO> getAssignmentsByProjectId(String projectId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_ASSIGNMENTS_BY_PROJECT_SP")
                .registerStoredProcedureParameter("p_project_id", String.class, jakarta.persistence.ParameterMode.IN)
                .registerStoredProcedureParameter("p_assignment_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_project_id", projectId);

        List<Object[]> results = query.getResultList();

        // Manual mapping from Object[] to our DTO
        return results.stream().map(r -> new ProjectAssignmentDetailsDTO(
                ((Number) r[0]).longValue(), // assignmentId
                (String) r[1],              // projectId
                (String) r[2],              // employeeId
                (String) r[3]               // fullName
        )).collect(Collectors.toList());
    }
    @Override
    @SuppressWarnings("unchecked")
    public List<AvailableEmployeeDTO> getUnassignedEmployees(String projectId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_UNASSIGNED_EMPLOYEES_FOR_PROJECT_SP")
                .registerStoredProcedureParameter("p_project_id", String.class, jakarta.persistence.ParameterMode.IN)
                .registerStoredProcedureParameter("p_employee_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_project_id", projectId);

        List<Object[]> results = query.getResultList();

        return results.stream().map(r -> {
            AvailableEmployeeDTO dto = new AvailableEmployeeDTO();
            dto.setEmployeeId((String) r[0]);
            dto.setFirstName((String) r[1]);
            dto.setLastName((String) r[2]);
            return dto;
        }).collect(Collectors.toList());
    }
    @Override
    @SuppressWarnings("unchecked")
    public List<String> getAssignedEmployeeIdsForProject(String projectId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_ASSIGNED_EMPLOYEE_IDS_FOR_PROJECT_SP")
                .registerStoredProcedureParameter("p_project_id", String.class, ParameterMode.IN)
                .registerStoredProcedureParameter("p_employee_id_cursor", Class.class, ParameterMode.REF_CURSOR);

        query.setParameter("p_project_id", projectId);

        // The result is a List of single-element Object arrays, so we map it to a List of Strings
        return (List<String>) query.getResultList();
    }
}