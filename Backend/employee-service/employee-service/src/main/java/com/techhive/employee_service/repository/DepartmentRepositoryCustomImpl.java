package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Department;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class DepartmentRepositoryCustomImpl implements DepartmentRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Department> getAllDepartmentsWithCount() {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_DEPARTMENTS_WITH_COUNT_SP")
                .registerStoredProcedureParameter("p_department_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        List<Object[]> results = query.getResultList();

        // Manually map the Object[] results to our Department entity
        return results.stream().map(r -> {
            Department dept = new Department();
            dept.setDepartmentId(((Number) r[0]).intValue());
            dept.setDepartmentName((String) r[1]);
            dept.setEmployeeCount(((Number) r[2]).longValue());
            return dept;
        }).collect(Collectors.toList());
    }
}