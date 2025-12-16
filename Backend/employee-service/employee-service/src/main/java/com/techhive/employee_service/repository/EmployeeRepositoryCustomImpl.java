package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import com.techhive.employee_service.dto.DepartmentEmployeeDTO;
import java.util.stream.Collectors;

import java.util.List;

public class EmployeeRepositoryCustomImpl implements EmployeeRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Object[]> getRawDashboardData(String employeeId) {
        // We will build the query manually instead of relying on the named query
        // This gives us more control.
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GET_EMPLOYEE_DASHBOARD_SP");

        // Explicitly register all parameters
        query.registerStoredProcedureParameter("p_employee_id", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("p_dashboard_cursor", void.class, ParameterMode.REF_CURSOR);

        // Set the IN parameter value
        query.setParameter("p_employee_id", employeeId);

        // Execute and get the results
        return query.getResultList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<DepartmentEmployeeDTO> getEmployeesByDepartment(Integer departmentId) {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GET_EMPLOYEES_BY_DEPARTMENT_SP");

        query.registerStoredProcedureParameter("p_department_id", Integer.class, jakarta.persistence.ParameterMode.IN);
        query.registerStoredProcedureParameter("p_employee_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_department_id", departmentId);

        List<Object[]> results = query.getResultList();

        // Manual mapping to DTO
        return results.stream().map(r -> {
            DepartmentEmployeeDTO dto = new DepartmentEmployeeDTO();
            dto.setEmployeeId((String) r[0]);
            dto.setFirstName((String) r[1]);
            dto.setLastName((String) r[2]);
            dto.setJobTitle((String) r[3]);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Employee> getAllEmployees() {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_ALL_EMPLOYEES_SP", Employee.class) // Tell Hibernate the result type
                .registerStoredProcedureParameter("p_employee_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        return query.getResultList();
    }
}