package com.techhive.employee_service.repository;
import com.techhive.employee_service.dto.SalaryInfoDTO;
import com.techhive.employee_service.model.Salary;
import java.util.List;
import java.util.Optional;

public interface SalaryRepositoryCustom {
    List<Salary> getAllSalaryDetails();

    List<SalaryInfoDTO> getAllEmployeeSalaryInfo();

    Optional<Salary> getSalaryByEmployeeId(String employeeId);

}