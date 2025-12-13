package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Salary;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;
import com.techhive.employee_service.dto.SalaryInfoDTO;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Repository
public class SalaryRepositoryCustomImpl implements SalaryRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Salary> getAllSalaryDetails() {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_ALL_SALARY_DETAILS_SP")
                .registerStoredProcedureParameter("p_salary_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        List<Object[]> results = query.getResultList();

        return results.stream().map(r -> {
            Salary salary = new Salary();
            salary.setSalaryId(((Number) r[0]).longValue());
            salary.setEmployeeId((String) r[1]);
            salary.setFirstName((String) r[2]);
            salary.setLastName((String) r[3]);
            salary.setAmount((BigDecimal) r[4]);
            salary.setPayFrequency((String) r[5]);
            salary.setEffectiveDate(((Date) r[6]).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate());
            return salary;
        }).collect(Collectors.toList());
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<SalaryInfoDTO> getAllEmployeeSalaryInfo() {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_ALL_EMPLOYEE_SALARY_INFO_SP")
                .registerStoredProcedureParameter("p_employee_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        List<Object[]> results = query.getResultList();

        // Manually map the Object[] results to our new SalaryInfoDTO
        return results.stream().map(r -> {
            SalaryInfoDTO dto = new SalaryInfoDTO();
            dto.setEmployeeId((String) r[0]);
            dto.setFirstName((String) r[1]);
            dto.setLastName((String) r[2]);
            dto.setAmount((BigDecimal) r[3]); // Can be null
            dto.setPayFrequency((String) r[4]); // Can be null
            // Handle null dates
            Date effectiveDateRaw = (Date) r[5];
            dto.setEffectiveDate(effectiveDateRaw != null ? effectiveDateRaw.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @SuppressWarnings("unchecked")
    public Optional<Salary> getSalaryByEmployeeId(String employeeId) {
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("GET_SALARY_BY_EMPLOYEE_ID_SP")
                .registerStoredProcedureParameter("p_employee_id", String.class, jakarta.persistence.ParameterMode.IN)
                .registerStoredProcedureParameter("p_salary_cursor", Class.class, jakarta.persistence.ParameterMode.REF_CURSOR);

        query.setParameter("p_employee_id", employeeId);

        List<Object[]> results = query.getResultList();

        // Use stream().findFirst() to safely get the first result, or an empty Optional
        return results.stream().findFirst().map(r -> {
            Salary salary = new Salary();
            salary.setSalaryId(((Number) r[0]).longValue());
            salary.setEmployeeId((String) r[1]);
            salary.setAmount((BigDecimal) r[2]);
            salary.setPayFrequency((String) r[3]);
            Date effectiveDateRaw = (Date) r[4];
            // Convert java.util.Date to Instant, then to LocalDate
            salary.setEffectiveDate(effectiveDateRaw != null ? effectiveDateRaw.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null);
            return salary;
        });
    }
}