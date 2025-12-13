package com.techhive.employee_service.controller;

import com.techhive.employee_service.dto.ProjectAssignmentDTO;
import com.techhive.employee_service.dto.EmployeeDashboardDTO;
import com.techhive.employee_service.dto.CredentialsDTO;
import com.techhive.employee_service.dto.AvailableEmployeeDTO;
import com.techhive.employee_service.dto.DepartmentEmployeeDTO;
import com.techhive.employee_service.model.Employee;
import com.techhive.employee_service.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee newEmployee = employeeService.addEmployee(employee);
        return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok) // If employee is found, return 200 OK with the employee
                .orElse(ResponseEntity.notFound().build()); // If not found, return 404 Not Found
    }

    @GetMapping("/{employeeId}/projects")
    public ResponseEntity<List<ProjectAssignmentDTO>> getAssignedProjects(@PathVariable String employeeId) {
        List<ProjectAssignmentDTO> assignments = employeeService.getAssignedProjectsForEmployee(employeeId);
        return ResponseEntity.ok(assignments);
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<Void> updateEmployee(
            @PathVariable String employeeId,
            @RequestBody Employee employeeDetails) {
        long updatedCount = employeeService.updateEmployee(employeeId, employeeDetails);
        if (updatedCount > 0) {
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // <<<--- AND ADD THIS METHOD ---<<<
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String employeeId) {
        long deletedCount = employeeService.deleteEmployee(employeeId);
        if (deletedCount > 0) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @GetMapping("/{employeeId}/dashboard")
    public ResponseEntity<EmployeeDashboardDTO> getEmployeeDashboard(@PathVariable String employeeId) {
        return employeeService.getEmployeeDashboard(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{employeeId}/credentials")
    public ResponseEntity<CredentialsDTO> getEmployeeCredentials(@PathVariable String employeeId) {
        return employeeService.getEmployeeCredentials(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public List<AvailableEmployeeDTO> getAvailableEmployees() {
        return employeeService.getAvailableEmployees();
    }

    @GetMapping("/by-department/{departmentId}")
    public List<DepartmentEmployeeDTO> getEmployeesByDepartment(@PathVariable Integer departmentId) {
        return employeeService.getEmployeesByDepartment(departmentId);
    }
}