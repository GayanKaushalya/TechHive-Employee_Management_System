package com.techhive.employee_service.controller;

import com.techhive.employee_service.model.Salary;
import com.techhive.employee_service.dto.SalaryInfoDTO;
import com.techhive.employee_service.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salaries")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @PutMapping
    public ResponseEntity<Void> assignOrUpdateSalary(@RequestBody Salary salary) {
        salaryService.assignOrUpdateSalary(salary);
        return ResponseEntity.ok().build(); // Return 200 OK for a successful upsert
    }

    @GetMapping
    public List<SalaryInfoDTO> getAllSalaries() {
        return salaryService.getAllSalaries();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Salary> getSalaryByEmployeeId(@PathVariable String employeeId) {
        return salaryService.getSalaryByEmployeeId(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}