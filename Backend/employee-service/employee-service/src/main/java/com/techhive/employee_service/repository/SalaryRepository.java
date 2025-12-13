package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long>, SalaryRepositoryCustom {

    @Procedure(procedureName = "UPSERT_SALARY_SP")
    void upsertSalaryProcedure(
            @Param("p_employee_id") String employeeId,
            @Param("p_amount") BigDecimal amount,
            @Param("p_pay_frequency") String payFrequency,
            @Param("p_effective_date") LocalDate effectiveDate
    );

    @Procedure(name = "getAllSalaryDetails")
    List<Salary> getAllSalaryDetailsProcedure();;
}