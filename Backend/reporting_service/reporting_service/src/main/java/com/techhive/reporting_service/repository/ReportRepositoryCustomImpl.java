package com.techhive.reporting_service.repository;

import com.techhive.reporting_service.dto.ProjectDetailsDTO;
import com.techhive.reporting_service.dto.TeamMemberDTO;

import com.techhive.reporting_service.dto.DepartmentDetailsDTO;
import com.techhive.reporting_service.dto.DepartmentMemberDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ReportRepositoryCustomImpl implements ReportRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, List<?>> getProjectAssignmentData(String projectId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_PROJECT_ASSIGNMENT_DATA_SP")
                .registerStoredProcedureParameter("p_project_id", String.class, jakarta.persistence.ParameterMode.IN)
                .registerStoredProcedureParameter("p_project_details_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR)
                .registerStoredProcedureParameter("p_team_roster_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_project_id", projectId);

        // --- THE FIXES ARE IN THIS SECTION ---

        // Get the first result set (Project Details)
        List<Object[]> projectDetailsResults = query.getResultList();
        List<ProjectDetailsDTO> projectDetails = projectDetailsResults.stream()
                .map(r -> new ProjectDetailsDTO(
                        (String) r[0], // projectId
                        (String) r[1], // projectName
                        (String) r[2], // description
                        (String) r[3], // status
                        // FIX 1: Use the universal conversion method
                        ((Timestamp) r[4]).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate(),
                        r[5] != null ? ((Timestamp) r[5]).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : null
                )).collect(Collectors.toList());

        // FIX 2: Use the hasMoreResults() and getResultList() combination to advance the cursor
        // This is the standard JPA way to handle multiple result sets.
        if (query.hasMoreResults()) {
            List<Object[]> teamRosterResults = query.getResultList();
            List<TeamMemberDTO> teamRoster = teamRosterResults.stream()
                    .map(r -> new TeamMemberDTO((String) r[0], (String) r[1], (String) r[2], (String) r[3]))
                    .collect(Collectors.toList());

            Map<String, List<?>> finalResult = new HashMap<>();
            finalResult.put("details", projectDetails);
            finalResult.put("team", teamRoster);
            return finalResult;
        }

        // Return empty map if something went wrong and the second cursor doesn't exist
        return new HashMap<>();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, List<?>> getDepartmentDetailData(Integer departmentId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_DEPARTMENT_DETAILS_REPORT_SP")
                .registerStoredProcedureParameter("p_department_id", Integer.class, jakarta.persistence.ParameterMode.IN)
                .registerStoredProcedureParameter("p_department_details_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR)
                .registerStoredProcedureParameter("p_member_list_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_department_id", departmentId);
        query.execute();

        // 1. Process the first result set (Department Details)
        List<Object[]> detailsResults = query.getResultList();
        List<DepartmentDetailsDTO> departmentDetails = detailsResults.stream()
                .map(r -> {
                    DepartmentDetailsDTO dto = new DepartmentDetailsDTO();
                    dto.setDepartmentId(((Number) r[0]).intValue());
                    dto.setDepartmentName((String) r[1]);
                    dto.setEmployeeCount(((Number) r[2]).longValue());
                    return dto;
                }).collect(Collectors.toList());

        // 2. Process the second result set (Member List)
        List<DepartmentMemberDTO> memberList = List.of(); // Default to empty list
        if (query.hasMoreResults()) {
            List<Object[]> memberResults = query.getResultList();
            memberList = memberResults.stream()
                    .map(r -> {
                        DepartmentMemberDTO dto = new DepartmentMemberDTO();
                        dto.setEmployeeId((String) r[0]);
                        dto.setFullName((String) r[1]);
                        dto.setJobTitle((String) r[2]);
                        dto.setEmail((String) r[3]);
                        return dto;
                    }).collect(Collectors.toList());
        }

        // 3. Combine into a Map and return
        Map<String, List<?>> finalResult = new HashMap<>();
        finalResult.put("details", departmentDetails);
        finalResult.put("members", memberList);

        return finalResult;
    }
}