package com.techhive.employee_service.service;

import com.techhive.employee_service.model.Salary;
import com.techhive.employee_service.dto.SalaryInfoDTO;
import com.techhive.employee_service.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SalaryService {

    @Autowired
    private SalaryRepository salaryRepository;

    @Transactional
    public void assignOrUpdateSalary(Salary salary) {
        salaryRepository.upsertSalaryProcedure(
                salary.getEmployeeId(),
                salary.getAmount(),
                salary.getPayFrequency(),
                salary.getEffectiveDate()
        );
    }

    @Transactional(readOnly = true)
    public Optional<Salary> getSalaryByEmployeeId(String employeeId) {
        // Call the new custom repository method
        return salaryRepository.getSalaryByEmployeeId(employeeId);
    }

    @Transactional(readOnly = true)
    public List<SalaryInfoDTO> getAllSalaries() {
        // It now calls our new custom method and returns the DTO list
        return salaryRepository.getAllEmployeeSalaryInfo();
    }

}